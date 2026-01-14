import asyncio
import uuid

from fastapi import HTTPException
from sqlmodel import Session

from app.models import Message, ToolCall
from app.schemas.Message import NewMessage, Role, Status


class BaseProvider:
    def __init__(self, session: Session):
        self.session = session

    def save_message(
        self, session_id: uuid.UUID, owner_id: uuid.UUID, new_message: NewMessage
    ) -> tuple[uuid.UUID | None, HTTPException | None]:
        """Save user message to session

        Args:
            session_id (uuid.UUID): session id
            owner_id (uuid.UUID): user id
            new_message (NewMessage): message

        Returns:
            tuple[uuid.UUID| None, HTTPException | None]:"""

        message_obj = Message.model_validate(
            new_message, update={"owner_id": owner_id, "session_id": session_id}
        )
        try:
            self.session.add(message_obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            return None, HTTPException(status_code=400, detail=str(e))

        return message_obj.id, None

    async def update_message_async(
        self, message_id: uuid.UUID, status: Status, role: Role, content: str
    ):
        await asyncio.to_thread(self.update_message, message_id, status, role, content)

    def update_message(
        self, message_id: uuid.UUID, status: Status, role: Role, content: str
    ) -> tuple[uuid.UUID | None, HTTPException | None]:
        """
        Args:
            message_id (uuid.UUID): descriptiond
            status (Status): description
            role (Role): description
            content (str): description

        """
        msg = self.session.get(Message, message_id)
        msg.status = status
        msg.role = role
        msg.content = content
        try:
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            return None, HTTPException(status_code=400, detail=str(e))

        return msg.id, None

    async def save_tool_call_async(
        self,
        session_id: uuid.UUID,
        name: str,
        args: dict,
        result: str,
        owner_id: uuid.UUID,
    ):
        await asyncio.to_thread(
            self.save_tool_call, session_id, name, args, result, owner_id
        )

    def save_tool_call(
        self,
        session_id: uuid.UUID,
        name: str,
        args: dict,
        result: str,
        owner_id: uuid.UUID,
    ):
        tool_call_obj = ToolCall(
            name=name,
            args=args,
            result=result,
            owner_id=owner_id,
            session_id=session_id,
        )

        self.session.add(tool_call_obj)
        self.session.commit()

    def execute_tool(self, tool_name: str, args: dict):
        pass

    @classmethod
    async def process_stream(
        cls,
        chat_history: list,
        model_name: str,
        owner_id: uuid.UUID,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
    ):
        raise NotImplementedError
