import uuid

from sqlmodel import Field, SQLModel


class ToolCallBase(SQLModel):
    name: str = Field(max_length=255, nullable=False)
    args: str = Field(max_length=255, nullable=False)


class NewToolCall(ToolCallBase):
    session_id: uuid.UUID
