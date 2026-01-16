import asyncio
import json
import logging
import uuid

from composio import Composio
from fastapi import BackgroundTasks, HTTPException
from sqlmodel import Session

from app.api.routes.websockets import manager
from app.models import Message, ToolCall
from app.providers.Tools import Tools
from app.schemas.Message import NewMessage, ResponseType, Role, Status

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class BaseProvider:
    def __init__(self, session: Session):
        self.session = session
        self.composio_user_id = "0000-1111-2222"
        self.composio = Composio()
        self.tools = Tools()
        self.manager = manager
        self.background_tasks = BackgroundTasks()

    def save_message(
        self, session_id: uuid.UUID, owner_id: uuid.UUID, new_message: NewMessage
    ) -> tuple[uuid.UUID | None, HTTPException | None]:
        """Save user message to session

        Args:
            session_id (uuid.UUID): session id
            owner_id (uuid.UUID): user id
            new_message (NewMessage): message

        Returns:
            tuple[uuid.UUID| None, HTTPException | None]:"""

        message_obj = Message.model_validate(
            new_message, update={"owner_id": owner_id, "session_id": session_id}
        )
        try:
            self.session.add(message_obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            return None, HTTPException(status_code=400, detail=str(e))

        return message_obj.id, None

    async def update_message_async(
        self, message_id: uuid.UUID, status: Status, role: Role, content: str
    ):
        await asyncio.to_thread(self.update_message, message_id, status, role, content)

    def update_message(
        self, message_id: uuid.UUID, status: Status, role: Role, content: str
    ) -> tuple[uuid.UUID | None, HTTPException | None]:
        """
        Args:
            message_id (uuid.UUID): descriptiond
            status (Status): description
            role (Role): description
            content (str): description

        """
        msg = self.session.get(Message, message_id)
        msg.status = status
        msg.role = role
        msg.content = content
        try:
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            return None, HTTPException(status_code=400, detail=str(e))

        return msg.id, None

    async def save_tool_call_async(
        self,
        session_id: uuid.UUID,
        name: str,
        args: dict,
        result: str,
        owner_id: uuid.UUID,
    ):
        await asyncio.to_thread(
            self.save_tool_call, session_id, name, args, result, owner_id
        )

    def save_tool_call(
        self,
        session_id: uuid.UUID,
        name: str,
        args: dict,
        result: str,
        owner_id: uuid.UUID,
    ):
        tool_call_obj = ToolCall(
            name=name,
            args=args,
            result=result,
            owner_id=owner_id,
            session_id=session_id,
        )

        self.session.add(tool_call_obj)
        self.session.commit()

    async def execute_tools(
        self,
        chat_history: list,
        message_id: uuid.UUID,
        session_id: uuid.UUID,
        tool_calls: dict,
        owner_id: uuid.UUID,
        model_name: str,
    ):
        """
        Execute tools that are in the tool_calls dict. Get result and send it to the manager.
        Then form a response.

        Args:
            chat_history (list): chat history
            message_id (uuid.UUID): message id
            session_id (uuid.UUID): session id
            tool_calls (dict): tool calls
            owner_id (uuid.UUID): user id
            model_name (str): model name

        """
        logger.info(f"TOOL CALLS: {tool_calls}")
        # Execute the tool calls
        for tool_idx, tool in tool_calls.items():
            # get name and args
            tool_name = tool["name"]
            args_str = tool["arguments"]

            # if there is no tool name, skip
            if not tool_name:
                logger.info(f"[DEBUG] No tool name for idx={tool_idx}, skipping")
                continue  # continue

            # try to parse the arguments
            try:
                parsed_args = json.loads(args_str)
            except json.JSONDecodeError:
                parsed_args = {}
                logger.info(
                    f"[DEBUG] Failed to parse args for idx={tool_idx}, using empty dict"
                )
                continue  # continue

            # send the tool call to the manager
            await self.manager.stream_response_chunk(
                message_id=str(message_id),
                chunk={
                    "tool_name": tool_name,
                    "tool_input": parsed_args,
                },
                is_complete=False,
                msg_type=ResponseType.TOOL_CALL,
            )

            # execute the tool
            true_result = None
            msg_type = ResponseType.TOOL_RESULT
            result, error = await self.execute_tool(tool_name, parsed_args)
            if not result and error:
                true_result = error
                msg_type = ResponseType.TOOL_ERROR
            logger.info(f"[DEBUG] Tool result for idx={tool_idx}: {true_result}")
            # save the tool call after it has been executed
            self.save_tool_call_async(
                session_id=session_id,
                name=tool_name,
                args=parsed_args,
                result=true_result,
                owner_id=owner_id,
            )
            # send the tool result to the manager
            await self.manager.stream_response_chunk(
                message_id=str(message_id),
                chunk=json.dumps(
                    {
                        "tool_name": tool_name,
                        "tool_result": true_result,
                    }
                ),
                is_complete=True,
                msg_type=msg_type,
            )

            # Add the tool call result to the chat history for the final response
            chat_history.append(
                {
                    "role": Role.ASSISTANT,
                    "content": f"TOOL_NAME: {tool_name}, RESULT: {true_result}",
                }
            )
            self.background_tasks.add_task(
                self.process_stream,
                chat_history=chat_history,
                model_name=model_name,
                owner_id=owner_id,
                session_id=session_id,
                message_id=message_id,
                tool_choice="none",
            )

    async def execute_tool(
        self, tool_name: str, args: dict
    ) -> tuple[str | None, str | None]:
        """
        Args:
            tool_name (str): description
            args (dict): description

        """
        result = None
        try:
            if tool_name == "arxiv_search":
                result = self.tools.arxiv_search(**args)
            elif tool_name == "wiki_search":
                result = self.tools.wiki_search(**args)
            else:
                result = await self.composio.tools.execute(
                    slug=tool_name,
                    user_id=self.composio_user_id,
                    arguments=args,
                )
        except Exception as e:
            return result, f"Error executing tool: {e}"

        return result, None

    @classmethod
    async def process_stream(
        cls,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
        tool_choice: str = "auto",
    ):
        raise NotImplementedError
