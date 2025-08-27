import os
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
import logging
from app.chat.utils.schemas import APIResponseType

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
load_dotenv(Path("../../.env"))
response_types = APIResponseType(message="message", function_call="function_call")


class ChatService:
    def __init__(self, user_id: str, session_id: str):
        self.user_id = user_id
        self.session_id = session_id
        self.chat_session = None
        self.model_name = "gpt-4.1-mini"
        self.llm: OpenAI = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def process_message(self, message: str):
        full_response = []
        # stream the response
        response = self.llm.responses.create(
            model=self.model_name,
            input=self.chat_history,
            tools=self.tools,
            tool_choice="auto",
        )

        if response.output[0].type == response_types.message:
            logger.info(f"response.output_text: {response.output_text}")
            return {"type": "response", "content": response.output_text}

        if response.output[0].type == response_types.function_call:
            for tool_call in response.output:
                name = tool_call.name
                args = tool_call.arguments
                full_response.append(
                    {
                        "type": "tool_use",
                        "tool_name": name,
                        "tool_input": args,
                    }
                )
                try:
                    result = self.execute_tool(tool_call.name, tool_call.arguments)
                except Exception as e:
                    logger.error(f"Failed to execute tool: {e}")
                    result = "Failed to execute tool"
                full_response.append(
                    {
                        "type": "tool_result",
                        "tool_name": name,
                        "tool_input": args,
                        "tool_result": result,
                    }
                )
        final_response = self.llm.responses.create(
            model=self.model_name,
            input=self.chat_history,
        )

        full_response.append(
            {
                "type": "final_response",
                "content": final_response.output_text,
            }
        )

        return full_response

    def execute_tool(self, tool_name: str, tool_args: dict):
        """Execute a tool

        Args:
            tool_name (str): The name of the tool to execute
            tool_args (dict): The arguments to pass to the tool

        Returns:
            Any: The result of the tool

        """
        logger.info(f"Executing tool: {tool_name} with args: {tool_args}")
        logger.info(
            f"Tool Name Type {type(tool_name)}, Tool Args Type {type(tool_args)}"
        )
        try:
            if tool_name == "analyze_events":
                if "get_events_in_month" not in self.tool_history:
                    return "Please run get_events_in_month first"
                result = analyze_events(**tool_args)
            elif tool_name == "create_event":
                result = self.calendar_service.create_event(tool_args)
            elif tool_name == "update_event":
                result = self.calendar_service.update_event(**tool_args)
            elif tool_name == "delete_event":
                result = self.calendar_service.delete_event(**tool_args)
            elif tool_name == "get_events_in_month":
                result = self.calendar_service.get_events_in_month()
            else:
                result = self.composio.tools.execute(
                    slug=tool_name,
                    user_id=self.composio_user_id,
                    arguments=tool_args,
                )
            logger.info(f"Tool result: {result}")
            logger.info(f"Result type: {type(result)}")
            return result
        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            logger.info("!!! TOOL EXECUTION EXCEPTION !!!")
            logger.info(f"Error type: {type(e).__name__}")
            logger.info(f"Error message: {str(e)}")
            logger.info(f"Traceback: {traceback.format_exc()}")

            return {"error": error_msg}
