import uuid
from enum import Enum

from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel


class Role(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageBase(SQLModel):
    role: Role = Field(default=Role.USER, nullable=False)
    content: str = Field(sa_column=Column(Text, nullable=False))


class NewMessage(MessageBase):
    # session_id: uuid.UUID
    model_name: str
    # prev_messages: list[MessageBase] | None = None


class MessageDetail(MessageBase):
    id: uuid.UUID
    # created_at: str
