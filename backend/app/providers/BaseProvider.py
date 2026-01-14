import asyncio
import json
import logging
import uuid

from composio import Composio
from fastapi import HTTPException
from sqlmodel import Session

from app.api.routes.websockets import manager
from app.models import Message, ToolCall
from app.providers.Tools import Tools
from app.schemas.Message import NewMessage, Role, Status

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
    ):
        logger.info(f"TOOL CALLS: {tool_calls}")
        # Execute the tool calls
        for tool_idx, tool in tool_calls.items():
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
            await manager.stream_response_chunk(
                message_id=str(message_id),
                chunk={
                    "tool_name": tool_name,
                    "tool_input": parsed_args,
                },
                is_complete=False,
                msg_type="tool_call",
            )

            # execute the tool
            try:
                result = await self.execute_tool(tool_name, parsed_args)
            except TypeError:
                result = await self.execute_tool(tool_name, parsed_args.get("location"))

            logger.info(f"[DEBUG] Tool result for idx={tool_idx}: {result}")
            # save the tool call after it has been executed
            self.save_tool_call_async(
                session_id=session_id,
                name=tool_name,
                args=parsed_args,
                result=result,
                owner_id=owner_id,
            )
            # send the tool result to the manager
            await manager.stream_response_chunk(
                message_id=str(message_id),
                chunk={
                    "tool_name": tool_name,
                    "tool_result": result,
                },
                is_complete=True,
                msg_type="tool_result",
            )

            # Add the tool call result to the chat history for the final response
            chat_history.append(
                {
                    "role": Role.ASSISTANT,
                    "content": f"TOOL_NAME: {tool_name}, RESULT: {result}",
                }
            )

    async def execute_tool(self, tool_name: str, args: dict):
        """
        Args:
            tool_name (str): description
            args (dict): description

        """
        try:
            if tool_name == "arxiv_search":
                result = await self.tools.arxiv_search(**args)
            elif tool_name == "wiki_search":
                result = await self.tools.wiki_search(**args)
            else:
                result = await self.composio.tools.execute(
                    slug=tool_name,
                    user_id=self.composio_user_id,
                    arguments=args,
                )
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=str(f"Error executing tool: {e}")
            )
        return result

    @classmethod
    async def process_stream(
        cls,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
    ):
        raise NotImplementedError
