import uuid

from openai import OpenAI
from sqlmodel import Session

from app.core.config import settings
from app.models import User


class APIService:
    def __init__(self, session: Session):
        self.session = session
        self.openai: OpenAI = OpenAI(settings.OPENAI_API_KEY)
        pass

    def prep_request(
        self, user: User, id: uuid.UUID, message: str, session_id: uuid.UUID
    ):
        pass

    def process_message_stream(
        self, user: User, id: uuid.UUID, message: str, session_id: uuid.UUID
    ):
        pass
