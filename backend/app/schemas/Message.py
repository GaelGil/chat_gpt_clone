import uuid
from enum import Enum

from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel

from app.schemas.ToolCall import ToolCallDetail


class Role(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Status(str, Enum):
    COMPLETE = "complete"
    FAILURE = "failure"
    STREAMING = "streaming"


class MessageBase(SQLModel):
    role: Role = Field(default=Role.USER, nullable=False)
    content: str = Field(sa_column=Column(Text, nullable=False))
    status: Status = Field(default=Status.COMPLETE, nullable=False)


class NewMessage(MessageBase):
    model_name: str


class MessageDetail(MessageBase):
    id: uuid.UUID
    tool_calls: list[ToolCallDetail]


class ResponseType(Enum):
    TOOL_CALL = "tool_call"
    TOOL_RESULT = "tool_result"
    TOOL_ERROR = "tool_error"
    MESSAGE_CHUNK = "message_chunk"
