import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import Session as SessionModel
from app.models import User
from app.schemas.Message import NewMessage
from app.schemas.Session import NewSession, SessionDetail, SessionList, SessionSimple


class SessionService:
    def __init__(self, session: Session):
        self.session = session
        pass

    def get_sessions(self, user: User) -> SessionList:
        if user.is_superuser:
            sessions = self.session.exec(select(SessionModel)).all()
        else:
            sessions = self.session.exec(
                select(SessionModel).where(SessionModel.owner_id == user.id)
            ).all()

        return SessionList(
            sessions=[SessionSimple.model_validate(session) for session in sessions]
        )

    def get_session(self, user: User, id: uuid.UUID) -> SessionDetail:
        session_obj = self.session.get(SessionModel, id)
        if not session_obj:
            raise HTTPException(status_code=404, detail="Session not found")
        if user.id != session_obj.owner_id:
            raise HTTPException(
                status_code=403, detail="The user doesn't have enough privileges"
            )
        return SessionDetail.model_validate(session_obj)

    def new_session(self, user: User, new_session: NewSession):
        session_obj = SessionModel.model_validate(
            new_session, update={"owner_id": user.id}
        )
        try:
            self.session.add(session_obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    def delete_session(self, user: User, id: uuid.UUID):
        session_obj = self.session.get(SessionModel, id)
        if not session_obj:
            raise HTTPException(status_code=404, detail="Session not found")
        if not user.is_superuser:
            if user.id != session_obj.owner_id:
                raise HTTPException(
                    status_code=403, detail="The user doesn't have enough privileges"
                )

        self.session.delete(session_obj)
        self.session.commit()

    def send_message(self, user: User, id: uuid.UUID, message: NewMessage):
        pass

    def verify_permissions(self, user: User):
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
