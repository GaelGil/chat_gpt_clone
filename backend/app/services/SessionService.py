import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import Session as SessionModel
from app.models import User
from app.schemas.Message import NewMessage
from app.schemas.Session import NewSession, SessionDetail, SessionList, SessionSimple
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

    def send_message(
        self, user_id: uuid.UUID, session_id: uuid.UUID, message: NewMessage
    ):
        self.api_service.prep_request(
            user_id=user_id, session_id=session_id, message=message
        )

        self.api_service.send_message_and_stream()

        pass

    def verify_permissions(
        self, user: User
    ) -> tuple[User | None, HTTPException | None]:
        if not user:
            return None, HTTPException(status_code=401, detail="Not authenticated")

        return user, None
