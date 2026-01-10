import logging
import uuid

from sqlmodel import Session

from app.providers.GeminiProvider import GeminiProvider
from app.providers.OpenAIProvider import OpenAIProvider

# logging stuff
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class APIService:
    def __init__(self, session: Session, tool_definitions: dict):
        self.session = session
        self.openai_models = {
            "gpt-5-mini",
            "gpt-4.1",
            "gpt-5.1",
            "gpt-5-nano",
        }
        self.genai_models = {
            "gemini-3-flash-preview",
            "gemini-2.5-pro",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
        }
        self.tools = tool_definitions
        self.openai = OpenAIProvider(session=session)
        self.genai = GeminiProvider(session=session)

    def map_provider(self, model_name: str) -> OpenAIProvider | GeminiProvider:
        if model_name in self.openai_models:
            return self.openai
        return self.genai

    async def process_stream(
        self,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
    ):
        """
        Select provider based on model name and process stream

        Args:
            chat_history (list): chat history
            model_name (str): model name
            owner_id (uuid.UUID): user id
            session_id (uuid.UUID): session id
            message_id (uuid.UUID): message id
        """
        # select provider
        provider = self.map_provider(model_name)

        # process stream
        await provider.process_stream(
            chat_history=chat_history,
            model_name=model_name,
            owner_id=owner_id,
            session_id=session_id,
            message_id=message_id,
        )
