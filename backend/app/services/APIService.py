import json
import logging
import uuid

from fastapi import HTTPException
from openai import OpenAI
from sqlmodel import Session

from app.models import Message, ToolCall
from app.schemas.Message import NewMessage, Role, Status

# logging stuff
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
# load env


class APIService:
    def __init__(self, session: Session, tool_definitions: dict):
        self.session = session
        self.openai: OpenAI = OpenAI()
        self.tools = tool_definitions
        pass

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
        pass

    async def process_stream(
        self,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
    ):
        # stream the response
        stream = self.openai.responses.create(
            model=model_name,
            input=chat_history,
            tools=self.tools,
            tool_choice="auto",
            stream=True,
        )

        tool_calls = {}
        init_response = ""
        # initial call
        for event in stream:
            # if there is text, print it
            if event.type == "response.output_text.delta":
                # yield the text
                yield json.dumps({"type": "response", "text": event.delta})
                init_response += event.delta
                # print(event.delta, end="", flush=True)
            # if there is no text, print a newline
            elif event.type == "response.output_text.done":
                logger.info("response.output_text.done")

            # else if there is a tool call
            # name of the tool is in response.output.item
            elif (
                event.type == "response.output_item.added"
                and event.item.type == "function_call"
            ):
                # output_index is the index of the tool call
                # because they come in chunks we need to keep track of the index
                idx = getattr(event, "output_index", 0)
                if idx not in tool_calls:
                    # if the index is not in the tool calls dict, add it
                    tool_calls[idx] = {
                        "name": None,
                        "arguments_fragments": [],
                        "arguments": None,
                        "done": False,
                    }
                tool_calls[idx]["name"] = event.item.name  # get the name of the tool

            # else if there is a tool argument (they come in chunks as strings)
            elif event.type == "response.function_call_arguments.delta":
                # output_index is the index of the tool call
                idx = getattr(event, "output_index", 0)
                if idx not in tool_calls:  # if not in the tool calls dict, add it
                    tool_calls[idx] = {
                        "name": None,
                        "arguments_fragments": [],
                        "arguments": None,
                        "done": False,
                    }
                # delta (arguments) may be a string fragment so we add it
                args_frag = (
                    event.delta
                    if isinstance(event.delta, str)
                    else json.dumps(event.delta)
                )
                # add up the argument strings for the tool call
                tool_calls[idx]["arguments_fragments"].append(args_frag)
                logger.info(f"[DEBUG] Arg fragment for idx={idx}: {args_frag}")

            # else if the tool call is done
            elif event.type == "response.function_call_arguments.done":
                # output_index is the index of the tool call
                idx = getattr(event, "output_index", 0)
                # if the index is not in the tool calls dict, add it
                if idx not in tool_calls:
                    tool_calls[idx] = {
                        "name": None,
                        "arguments_fragments": [],
                        "arguments": None,
                        "done": False,
                    }
                # mark the tool call as done
                tool_calls[idx]["done"] = True
                # join the argument fragments into a single string
                tool_calls[idx]["arguments"] = "".join(
                    tool_calls[idx]["arguments_fragments"]
                ).strip()
                # log statment for tool done
                logger.info(f"[DEBUG] Marked tool idx={idx} done")

        logger.info(f"TOOL CALLS: {tool_calls}")
        chat_history.append({"role": Role.ASSISTANT, "content": init_response})

        # self.save_message(
        #     session_id=session_id,
        #     content=init_response,
        #     role=Role.ASSISTANT,
        #     owner_id=owner_id,
        # )

        # self.

        # Execute the tool calls
        for tool_idx, tool in tool_calls.items():
            tool_name = tool["name"]
            args_str = tool["arguments"]

            if not tool_name:  # if tool name is None
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
            # yield the tool call
            yield json.dumps(
                {"type": "tool_use", "tool_name": tool_name, "tool_input": parsed_args}
            )
            try:
                result = self.execute_tool(tool_name, parsed_args)
            except TypeError:
                result = self.execute_tool(tool_name, parsed_args.get("location"))

            # result = self.parse_tool_result(tool_name, result)
            logger.info(f"[DEBUG] Tool result for idx={tool_idx}: {result}")
            self.save_tool_call(
                session_id=session_id,
                name=tool_name,
                args=parsed_args,
                result=result,
                owner_id=owner_id,
            )

            # yield the tool result
            yield json.dumps(
                {
                    "type": "tool_result",
                    "tool_name": tool_name,
                    "tool_input": parsed_args,
                    "tool_result": result,
                }
            )

            # Add the tool call result to the chat history
            chat_history.append(
                {
                    "role": Role.ASSISTANT,
                    "content": f"TOOL_NAME: {tool_name}, RESULT: {result}",
                }
            )
            # self.save_message(
            #     session_id=session_id,
            #     content=f"TOOL_NAME: {tool_name}, RESULT: {result}",
            #     role=Role.ASSISTANT,
            #     owner_id=owner_id,
            # )
            self.save_tool_call(
                session_id=session_id,
                name=tool_name,
                args=parsed_args,
                result=result,
                owner_id=owner_id,
            )

        logger.info(f"[DEBUG] CHAT HISTORY AFTER TOOL RUN: {chat_history}")
        # Get the final answer
        # IF we called tools to get updated information then we must form a final response
        if tool_calls:
            logger.info("[DEBUG] Calling model for final answer...")
            # Call the model again with the tool call results
            final_stream = self.openai.responses.create(
                model=model_name,
                input=chat_history,
                stream=True,
            )
            logger.info(f"[DEBUG] CHAT HISTORY AFTER FINAL LLM CALL: {chat_history}")

            final_response = ""

            for ev in final_stream:
                logger.info(
                    f"\n[DEBUG EVENT FINAL] type={ev.type}, delta={getattr(ev, 'delta', None)}"
                )
                # if there is text, print it/yield it
                if ev.type == "response.output_text.delta":
                    yield json.dumps({"type": "response", "text": ev.delta})
                    logger.info(f"response.output_text.delta: {ev.delta}")
                    final_response += ev.delta

                    # print(ev.delta, end="", flush=True)
                # if there is no text, print a newline
                elif ev.type == "response.output_text.done":
                    logger.info("response.output_text.done")
            chat_history.append({"role": Role.ASSISTANT, "content": final_response})

            message = NewMessage(
                content=f"{init_response} {final_response}",
                role=Role.ASSISTANT,
                status=Status.COMPLETE,
                model_name=model_name,
            )

            self.save_message(
                session_id=session_id,
                owner_id=owner_id,
                new_message=message,
            )

        pass

    def execute_tool(self, tool_name: str, args: dict):
        return f"Executed {tool_name} with args {args}"
