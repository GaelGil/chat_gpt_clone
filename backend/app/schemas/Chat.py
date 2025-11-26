# import uuid
# from datetime import datetime, timezone
# from typing import Optional

# from sqlmodel import Field, Relationship, SQLModel


# # ---------------- Chat Session ----------------
# class ChatSessionBase(SQLModel):
#     name: str


# class ChatSession(ChatSessionBase, table=True):
#     __tablename__ = "chat_session"

#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

#     messages: list["ChatMessage"] = Relationship(
#         back_populates="session", cascade_delete=True
#     )
#     tool_history: list["ToolHistory"] = Relationship(
#         back_populates="session", cascade_delete=True
#     )

#     model_config = {"arbitrary_types_allowed": True}


# # ---------------- Chat Message ----------------
# class ChatMessageBase(SQLModel):
#     role: str
#     content: str


# class ChatMessage(ChatMessageBase, table=True):
#     __tablename__ = "chat_message"

#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     session_id: uuid.UUID = Field(foreign_key="chat_session.id", nullable=False)
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

#     session: ChatSession = Relationship(back_populates="messages")
#     model_config = {"arbitrary_types_allowed": True}


# # ---------------- Tool History ----------------
# class ToolHistoryBase(SQLModel):
#     tool_name: str
#     tool_input: Optional[dict] = None
#     tool_output: str


# class ToolHistory(ToolHistoryBase, table=True):
#     __tablename__ = "tool_history"

#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     session_id: uuid.UUID = Field(foreign_key="chat_session.id", nullable=False)
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

#     session: ChatSession = Relationship(back_populates="tool_history")

#     model_config = {"arbitrary_types_allowed": True}
