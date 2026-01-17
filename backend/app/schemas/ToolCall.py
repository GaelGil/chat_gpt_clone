import uuid

from sqlmodel import Field, SQLModel


class ToolCallBase(SQLModel):
    name: str = Field(max_length=255, nullable=False)
    args: str = Field(max_length=255, nullable=False)
    result: str = Field(max_length=255, nullable=False)


class NewToolCall(ToolCallBase):
    session_id: uuid.UUID


class ToolCallDetail(ToolCallBase):
    id: uuid.UUID
