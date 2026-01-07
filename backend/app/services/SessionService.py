import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.api.routes.websockets import manager
from app.models import Message, User
from app.models import Session as SessionModel
from app.schemas.Message import NewMessage, Role
from app.schemas.Session import (
    NewSession,
    SessionDetail,
    SessionList,
    SessionSimple,
    UpdateSession,
)
from app.services.APIService import APIService


class SessionService:
    def __init__(self, session: Session, api_service: APIService):
        self.session = session
        self.api_service = api_service
        pass

    def get_sessions(
        self, user: User
    ) -> tuple[SessionList | None, None | HTTPException]:
        if user.is_superuser:
            sessions = self.session.exec(select(SessionModel)).all()
        else:
            try:
                sessions = self.session.exec(
                    select(SessionModel).where(SessionModel.owner_id == user.id)
                ).all()
            except Exception as e:
                return None, HTTPException(status_code=400, detail=str(e))

        return SessionList(
            sessions=[SessionSimple.model_validate(session) for session in sessions]
        ), None

    def get_session(
        self, user: User, session_id: uuid.UUID
    ) -> tuple[SessionDetail | None, None | HTTPException]:
        session_obj = self.session.get(SessionModel, session_id)
        if not session_obj:
            return None, HTTPException(status_code=404, detail="Session not found")
        if user.id != session_obj.owner_id:
            return None, HTTPException(
                status_code=403, detail="The user doesn't have enough privileges"
            )
        return SessionDetail.model_validate(session_obj), None

    def new_session(
        self, user: User, new_session: NewSession
    ) -> tuple[uuid.UUID | None, HTTPException | None]:
        session_obj = SessionModel.model_validate(
            new_session, update={"owner_id": user.id}
        )
        try:
            self.session.add(session_obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            return None, HTTPException(status_code=400, detail=str(e))

        return session_obj.id, None

    def delete_session(
        self, user: User, session_id: uuid.UUID
    ) -> tuple[bool, HTTPException | None]:
        session_obj = self.session.get(SessionModel, session_id)
        if not session_obj:
            return False, HTTPException(status_code=404, detail="Session not found")
        if not user.is_superuser:
            if user.id != session_obj.owner_id:
                return False, HTTPException(
                    status_code=403, detail="The user doesn't have enough privileges"
                )

        self.session.delete(session_obj)
        self.session.commit()

        return True, None

    def save_message(
        self, user_id: uuid.UUID, session_id: uuid.UUID, message: NewMessage
    ) -> tuple[uuid.UUID | None, HTTPException | None]:
        """
        Save user message to session

        Args:
            user_id (uuid.UUID): user id
            session_id (uuid.UUID): session id
            message (NewMessage): message

        Returns:
            tuple[uuid.UUID| None, HTTPException | None]:

        """
        if user_id is None:
            return False, HTTPException(status_code=401, detail="Not authenticated")

        message_id, save_error = self.api_service.save_message(
            session_id=session_id,
            owner_id=user_id,
            new_message=message,
        )

        if not message_id and save_error:
            return None, save_error

        return message_id, None

    def session_history(
        self, session_id: uuid.UUID, role: Role = None, content: str = None
    ) -> tuple[list | None, HTTPException | None]:
        chat_history = [
            {"role": str(msg.role.value), "content": msg.content}
            for msg in self.session.exec(
                select(Message).where(Message.session_id == session_id)
            )
        ]

        if role and content:
            chat_history.append({"role": role, "content": content})
        return chat_history, None

    async def generate_response(
        self,
        chat_history: list,
        model_name: str,
        session_id: uuid.UUID,
        message_id: uuid.UUID,
        user_id: uuid.UUID,
    ):
        # This returns an async generator
        # gen = self.api_service.process_stream(
        #     chat_history=chat_history,
        #     model_name=model_name,
        #     owner_id=user_id,
        #     session_id=session_id,
        #     message_id=message_id,
        # )

        full_title = ""
        try:
            async for chunk in self.api_service.process_stream(
                chat_history=chat_history,
                model_name=model_name,
                owner_id=user_id,
                session_id=session_id,
                message_id=message_id,
            ):
                print(f"DEBUG: chunk {chunk}")
                full_title += chunk
                await manager.stream_response_chunk(
                    message_id=str(message_id), chunk=chunk, is_complete=False
                )

            # Send completion signal
            await manager.stream_response_chunk(
                message_id=str(message_id), chunk="", is_complete=True
            )

            # self.update_canvas_title(uuid.UUID(canvas_id), full_title.strip())

        except Exception as e:
            # If title generation fails, keep "New Canvas" as title
            await manager.send_to_canvas(
                message_id=str(message_id),
                message={"type": "title_error", "error": str(e)},
            )

    def rename_session(
        self, user: User, session_id: uuid.UUID, update_session: UpdateSession
    ) -> tuple[bool | None, HTTPException | None]:
        """
        Args:
            user (User): user
            session (SessionDetail): session
            update_session (UpdateSession): update session
        """
        session = self.session.get(SessionModel, session_id)
        if not session:
            return False, HTTPException(status_code=404, detail="Session not found")
        if user.id != session.owner_id:
            return False, HTTPException(
                status_code=403, detail="The user doesn't have enough privileges"
            )

        session.title = update_session.title
        try:
            self.session.add(session)
            self.session.commit()
            self.session.refresh(session)
        except Exception:
            self.session.rollback()
            return False, HTTPException(
                status_code=400, detail="Error updating session {error}"
            )

        return True, None

    def verify_permissions(
        self, user: User
    ) -> tuple[User | None, HTTPException | None]:
        if not user:
            return None, HTTPException(status_code=401, detail="Not authenticated")

        return user, None
