import uuid
from typing import Any

from fastapi import APIRouter, BackgroundTasks

from app.api.deps import CurrentUser, SessionServiceDep
from app.schemas.Message import NewMessage
from app.schemas.Session import (
    NewSession,
    SessionDetail,
    SessionList,
    StreamResponseBody,
    UpdateSession,
)
from app.schemas.Utils import Message

router = APIRouter(prefix="/session", tags=["session"])


@router.get("/", response_model=SessionList)
def get_sessions(
    current_user: CurrentUser, session_service: SessionServiceDep
) -> SessionList:
    """
    Retrieve sessions
    """
    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error

    sessions, error = session_service.get_sessions(user=user)

    if error:
        raise error
    return sessions


@router.get("/{id}", response_model=SessionDetail)
def get_session(
    current_user: CurrentUser, session_id: uuid.UUID, session_service: SessionServiceDep
) -> SessionDetail:
    """
    Get a Session by ID.
    """
    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error
    session, error = session_service.get_session(user=user, session_id=session_id)

    if error:
        raise error

    return session


@router.post("/")
def new_session(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    new_session: NewSession,
) -> uuid.UUID:
    """
    Create a new Session
    """

    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error

    session_id, new_session_error = session_service.new_session(
        user=user, new_session=new_session
    )

    if new_session_error:
        raise new_session_error

    return session_id


@router.delete("/{id}", response_model=Message)
def delete_session(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    session_id: uuid.UUID,
) -> Any:
    """
    Delete a Session
    """
    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error

    deleted, error = session_service.delete_session(user=user, session_id=session_id)
    if not deleted and error:
        raise error

    return Message(message="Session deleted successfully")


@router.post("/{session_id}/add_message")
def add_message(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    message: NewMessage,
    session_id: uuid.UUID,
) -> uuid.UUID:
    """
    Add message to a session
    """

    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error

    message_id, save_error = session_service.save_message(
        user_id=user.id, session_id=session_id, message=message
    )

    if not message_id and save_error:
        raise save_error

    return message_id


@router.post("/{session_id}/stream")
async def stream_response(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    body: StreamResponseBody,
    background_tasks: BackgroundTasks,
    session_id: uuid.UUID,
) -> uuid.UUID:
    """
    Add message to a session
    """
    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error

    session_history, session_history_error = session_service.session_history(
        session_id=session_id
    )
    if session_history_error:
        raise session_history_error

    # Start background task to generate and stream response
    background_tasks.add_task(
        session_service.generate_response,
        chat_history=session_history,
        model_name=body.model_name,
        message_id=body.message_id,
        session_id=session_id,
        user_id=user.id,
    )

    return session_id


@router.put("/{id}")
async def rename_session(
    session_service: SessionServiceDep,
    current_user: CurrentUser,
    session_updates: UpdateSession,
    session_id: uuid.UUID,
) -> Message:
    """
    Update a Session
    """
    user, permission_error = session_service.verify_permissions(user=current_user)
    if permission_error:
        raise permission_error

    updated, update_error = session_service.rename_session(
        user=user, session_id=session_id, update_session=session_updates
    )

    if not updated and update_error:
        raise update_error

    return Message(message="Session was updated successfully")
