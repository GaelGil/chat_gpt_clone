import uuid
from enum import Enum

from sqlmodel import Field, SQLModel


class Role(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageBase(SQLModel):
    role: Role = Field(default=Role.USER, nullable=False)
    content: str = Field(max_length=255, nullable=False)


class NewMessage(MessageBase):
    session_id: uuid.UUID
    model_name: str
    prev_messages: list[MessageBase] | None = None


class Message(MessageBase):
    id: uuid.UUID
    created_at: str
