import logging
from helpers.schemas import ResponseFormat
from typing import AsyncIterable
import json

logger = logging.getLogger(__name__)


class PlannerAgent:
    def __init__(
        self,
        dev_prompt,
        mcp_client,
        llm,
        messages,
        max_turns,
        tools,
        model_name: str = "gpt-4.1-mini",
    ):
        self.model_name = model_name
        self.dev_prompt = dev_prompt
        self.mcp_client = mcp_client
        self.llm = llm
        self.max_turns = max_turns
        self.messages = messages
        self.tools = tools
        self.graph = []  # TODO: implement graph
        if self.dev_prompt:
            self.messages.append({"role": "developer", "content": self.dev_prompt})

    def plan(self, question: str):
        resp = self.client.responses.create(
            model="gpt-4o-mini",
            input=self._build_input(question),
            response_format=ResponseFormat,
            text_format="auto",
            stream=False,
        )
        parsed = resp.output[0].content[0].parsed
        return parsed  # instance of ResponseFormat

    async def stream(
        self, question: str, session_id: str, task_id: str
    ) -> AsyncIterable[dict]:
        logger.info(f"Planning stream session={session_id} task={task_id}")
        parsed = self.plan(question)
        if parsed.status in ("input_required", "error"):
            yield {
                "response_type": "text",
                "is_task_complete": False,
                "require_user_input": True,
                "content": parsed.question,
            }
        elif parsed.status == "completed":
            yield {
                "response_type": "data",
                "is_task_complete": True,
                "require_user_input": False,
                "content": [t.dict() for t in parsed.content],
            }
        else:
            yield {
                "response_type": "text",
                "is_task_complete": False,
                "require_user_input": True,
                "content": "Unexpected status",
            }

    def invoke(self, question: str, session_id: str) -> dict:
        parsed = self.plan(question)
        if parsed.status in ("input_required", "error"):
            return dict(
                response_type="text",
                is_task_complete=False,
                require_user_input=True,
                content=parsed.question,
            )
        return dict(
            response_type="data",
            is_task_complete=True,
            require_user_input=False,
            content=[t.dict() for t in parsed.content],
        )

    def _parse_response(self, response_text: str) -> dict:
        try:
            parsed = json.loads(response_text)
            tasks = parsed.get("tasks", [])
            if not tasks:
                return {
                    "response_type": "text",
                    "is_task_complete": False,
                    "require_user_input": True,
                    "content": "Could not determine tasks. Please clarify your input.",
                }
            return {
                "response_type": "data",
                "is_task_complete": True,
                "require_user_input": False,
                "content": tasks,
            }
        except Exception as e:
            logger.warning(f"Failed to parse Gemini output: {e}")
            return {
                "response_type": "text",
                "is_task_complete": False,
                "require_user_input": True,
                "content": "Invalid format received from planner model.",
            }

    def get_agent_response(self, config):
        current_state = self.graph.get_state(config)
        structured_response = current_state.values.get("structured_response")
        if structured_response and isinstance(structured_response, ResponseFormat):
            if (
                structured_response.status == "input_required"
                # and structured_response.content.tasks
            ):
                return {
                    "response_type": "text",
                    "is_task_complete": False,
                    "require_user_input": True,
                    "content": structured_response.question,
                }
            if structured_response.status == "error":
                return {
                    "response_type": "text",
                    "is_task_complete": False,
                    "require_user_input": True,
                    "content": structured_response.question,
                }
            if structured_response.status == "completed":
                return {
                    "response_type": "data",
                    "is_task_complete": True,
                    "require_user_input": False,
                    "content": structured_response.content.model_dump(),
                }
        return {
            "is_task_complete": False,
            "require_user_input": True,
            "content": "We are unable to process your code search request at the moment. Please try again.",
        }
