import logging
import uuid

from sqlmodel import Session

from app.database.schemas.Message import Role, Status
from app.providers.BaseProvider import BaseProvider

# logging stuff
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class GeminiProvider(BaseProvider):
    def __init__(self, session: Session):
        super().__init__(session)
        # self.client = /genai.Client()
        self.tools = {}

    async def process_stream(
        self,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
    ):
        # stream the response

        response = self.client.models.generate_content_stream(
            model=model_name, contents=chat_history
        )
        # tool_calls = {}
        init_response = ""
        for chunk in response:
            await self.manager.stream_response_chunk(
                message_id=str(message_id), chunk=chunk, is_complete=False
            )
            # yield chunk.text
            init_response += chunk.text

        await self.update_message_async(
            message_id=message_id,
            status=Status.COMPLETE,
            role=Role.ASSISTANT,
            content=f"{init_response}",
        )
