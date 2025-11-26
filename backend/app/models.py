# import base64
import uuid

from sqlmodel import Field, Relationship

from app.schemas.Message import MessageBase
from app.schemas.Session import SessionBase
from app.schemas.ToolCall import ToolCallBase
from app.schemas.User import UserBase


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    chat_sessions: list["Session"] = Relationship(
        back_populates="owner", cascade_delete=True
    )


class Session(SessionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: User = Relationship(back_populates="chat_sessions")
    messages: list["Message"] = Relationship(
        back_populates="session", cascade_delete=True
    )
    tool_history: list["ToolCall"] = Relationship(
        back_populates="session", cascade_delete=True
    )


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    session_id: uuid.UUID = Field(foreign_key="session.id", nullable=False)
    session: Session = Relationship(back_populates="messages")


class ToolCall(ToolCallBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    session_id: uuid.UUID = Field(foreign_key="chat_session.id", nullable=False)
    session: Session = Relationship(back_populates="tool_history")
