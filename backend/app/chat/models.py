from app.extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON


class ChatSession(db.Model):
    __tablename__ = "chat_sessions"
    id = db.Column(db.Integer, primary_key=True)  # SERIAL integer
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="chat_sessions")

    messages = db.relationship(
        "ChatMessage", back_populates="session", cascade="all, delete-orphan"
    )
    tool_history = db.relationship(
        "ToolHistory", back_populates="session", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.created_at.isoformat(),
                }
                for msg in self.messages
            ],
        }


class ChatMessage(db.Model):
    __tablename__ = "chat_messages"
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(
        db.Integer, db.ForeignKey("chat_sessions.id"), nullable=False
    )
    role = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    session = db.relationship("ChatSession", back_populates="messages")


class ToolHistory(db.Model):
    __tablename__ = "tool_history"
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(
        db.Integer, db.ForeignKey("chat_sessions.id"), nullable=False
    )
    tool_name = db.Column(db.String, nullable=False)
    tool_input = db.Column(JSON)  # <-- use JSON type
    tool_output = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    session = db.relationship("ChatSession", back_populates="tool_history")
