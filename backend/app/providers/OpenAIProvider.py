import json
import logging
import uuid

from openai import OpenAI
from sqlmodel import Session

from app.providers.BaseProvider import BaseProvider
from app.providers.tool_definitions import tool_definitions
from app.schemas.Message import Role, Status

# logging stuff
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class OpenAIProvider(BaseProvider):
    def __init__(self, session: Session):
        super().__init__(session)
        self.openai: OpenAI = OpenAI()
        self.tools = tool_definitions

    async def process_stream(
        self,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
        tool_choice: str = "auto",
    ):
        # stream the response
        stream = self.openai.responses.create(
            model=model_name,
            input=chat_history,
            tools=self.tools,
            tool_choice=tool_choice,
            stream=True,
        )

        tool_calls = {}
        response = ""
        # Initial call
        for event in stream:
            # if there is text, send it to the manager
            if event.type == "response.output_text.delta":
                await self.manager.stream_response_chunk(
                    message_id=str(message_id),
                    chunk=event.delta,
                    is_complete=False,
                    msg_type="message_chunk",
                )
                # add the text to the initial response
                response += event.delta
            # if the response is complete send it to the manager
            # and mark the message as complete
            elif event.type == "response.output_text.done":
                await self.manager.stream_response_chunk(
                    message_id=str(message_id),
                    chunk="",
                    is_complete=True,
                    msg_type="message_chunk",
                )
                # logger.info("response.output_text.done")

            # else if there is a tool call
            elif (
                event.type == "response.output_item.added"
                and event.item.type == "function_call"
            ):
                # output_index is the index of the tool call (there can be multiple tool calls)
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

        # add the response to the chat history
        chat_history.append({"role": Role.ASSISTANT, "content": response})

        # if there are tool calls we need to execute them
        if tool_calls:
            self.background_tasks.add_task(
                self.execute_tools,
                chat_history=chat_history,
                tools=tool_calls,
                message_id=message_id,
                session_id=session_id,
                owner_id=owner_id,
                model_name=model_name,
            )
            if tool_choice == "none":
                await self.update_message_async(
                    message_id=message_id,
                    status=Status.COMPLETE,
                    role=Role.ASSISTANT,
                    content=f"{response}",
                )
