import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Canvas,
    CanvasData,
    CanvasesPublic,
    CanvasPublic,
    Message,
    NewCanvasRequest,
    UpdateCanvasRequest,
)

router = APIRouter(prefix="/canvas", tags=["canvas"])


@router.get("/", response_model=CanvasesPublic)
def read_canvases(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve canvases.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Canvas)
        count = session.exec(count_statement).one()
        statement = select(Canvas).offset(skip).limit(limit)
        canvases = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Canvas)
            .where(Canvas.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Canvas)
            .where(Canvas.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        canvases = session.exec(statement).all()

    return CanvasesPublic(data=canvases, count=count)


@router.get("/{id}", response_model=CanvasData)
def read_canvas(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get canvas by ID.
    """
    canvas = session.get(Canvas, id)

    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    if not current_user.is_superuser and (canvas.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return canvas


@router.post("/", response_model=CanvasPublic)
def create_canvas(
    *, session: SessionDep, current_user: CurrentUser, canvas_in: NewCanvasRequest
) -> Any:
    """
    Create new canvas.
    """
    canvas = Canvas.model_validate(canvas_in, update={"owner_id": current_user.id})
    session.add(canvas)
    session.commit()
    session.refresh(canvas)
    return canvas


@router.put("/{id}", response_model=CanvasPublic)
def update_canvas(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    canvas_in: UpdateCanvasRequest,
) -> Any:
    """
    Update a canvas.
    """
    canvas = session.get(Canvas, id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    if not current_user.is_superuser and (canvas.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    canvas_data = canvas_in.model_dump(exclude_unset=True)

    canvas.sqlmodel_update(canvas_data)
    session.add(canvas)
    session.commit()
    session.refresh(canvas)
    return canvas


@router.delete("/{id}")
def delete_canvas(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a canvas.
    """
    canvas = session.get(Canvas, id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    if not current_user.is_superuser and (canvas.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(canvas)
    session.commit()
    return Message(message="Canvas deleted successfully")
