import uuid

from sqlmodel import Field, SQLModel

from app.schemas.Message import MessageDetail


class SessionBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)


class NewSession(SessionBase):
    pass


class DeleteSession(SQLModel):
    id: uuid.UUID


class SessionSimple(SessionBase):
    id: uuid.UUID


class SessionDetail(SessionSimple):
    messages: list[MessageDetail]


class SessionList(SQLModel):
    sessions: list[SessionSimple]


class UpdateSession(SessionBase):
    pass
