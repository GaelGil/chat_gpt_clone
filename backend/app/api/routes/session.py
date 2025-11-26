import uuid
from typing import Any

from fastapi import APIRouter

from app.api.deps import CurrentUser, SessionServiceDep
from app.schemas.Message import NewMessage
from app.schemas.Session import NewSession, SessionDetail, SessionList
from app.schemas.Utils import Message

router = APIRouter(prefix="/session", tags=["session"])


@router.get("/", response_model=SessionList)
def get_sessions(
    current_user: CurrentUser, session_service: SessionServiceDep
) -> SessionList:
    """
    Retrieve sessions
    """
    session_service.verify_permissions(user=current_user)
    sessions: SessionList = session_service.get_sessions(user=current_user)

    return sessions


@router.get("/{id}", response_model=SessionDetail)
def get_session(
    current_user: CurrentUser, id: uuid.UUID, session_service: SessionServiceDep
) -> SessionDetail:
    """
    Get a Session by ID.
    """
    session_service.verify_permissions(user=current_user)
    session: SessionDetail = session_service.get_session(user=current_user, id=id)

    return session


@router.post("/", response_model=Message)
def new_session(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    new_session: NewSession,
) -> Message:
    """
    Create a new Session
    """
    session_service.verify_permissions(user=current_user)
    session_service.new_session(user=current_user, new_session=new_session)
    return Message(message="Session created successfully")


@router.delete("/{id}", response_model=Message)
def delete_session(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    id: uuid.UUID,
) -> Any:
    """
    Delete a Session
    """
    session_service.verify_permissions(user=current_user)
    session_service.delete_session(user=current_user, id=id)
    return Message(message="Session deleted successfully")


@router.post("/{id}", response_model=Message)
def send_message(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    message: NewMessage,
    id: uuid.UUID,
) -> Message:
    """
    Add message to a session
    """
    session_service.verify_permissions(user=current_user)
    session_service.send_message(user=current_user, id=id, message=message)
    return Message(message="Message added successfully")
