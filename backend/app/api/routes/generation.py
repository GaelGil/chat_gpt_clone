import uuid
from typing import Any

import requests
from fastapi import APIRouter, HTTPException, Request
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Canvas,
    Generation,
    GenerationData,
    GenerationPublic,
    GenerationsPublic,
    Image,
    ImageGenerationsPublic,
    Message,
    NewGenerationRequest,
    NewGenerationResponse,
    ProviderInput,
    RoleEnum,
    UpdateGenerationRequest,
)
from app.services.generation import GenerationService
from app.utils import create_thumbnail, upload_image_bytes

router = APIRouter(prefix="/generation", tags=["generation"])


@router.get("/", response_model=GenerationsPublic)
def read_generations(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve generations.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Generation)
        count = session.exec(count_statement).one()
        statement = (
            select(Generation)
            .order_by(Generation.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        generations = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Generation)
            .where(Generation.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Generation)
            .order_by(Generation.created_at.desc())
            .where(Generation.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        generations = session.exec(statement).all()

    return GenerationsPublic(data=generations, count=count)


@router.get("/{id}", response_model=GenerationData)
def read_generation(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Any:
    """
    Get generation by ID.
    """
    generation = session.get(Generation, id)
    if not generation:
        raise HTTPException(status_code=404, detail="Canvas not found")
    if not current_user.is_superuser and (generation.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return generation


@router.post("/", response_model=NewGenerationResponse)
async def create_generation(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    generation_in: NewGenerationRequest,
) -> Any:
    """
    Create new generation.
    """
    canvas = session.get(Canvas, generation_in.canvas_id)

    if not generation_in.canvas_id:
        raise HTTPException(status_code=400, detail="Canvas id is required")
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    if canvas.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    generation = Generation.model_validate(
        generation_in, update={"owner_id": current_user.id}
    )

    gen_service = GenerationService()  # initialize generation service
    # convert to provider input
    provider_input = ProviderInput(**generation.model_dump())
    # get the request id from the generation service
    request_id = await gen_service.start_generation(**provider_input.model_dump())
    # add the request id to the generation
    generation.request_id = request_id

    session.add(generation)
    session.commit()
    session.refresh(generation)

    return NewGenerationResponse(
        message=f"Generating with prompt: {generation_in.prompt} and provider: {generation_in.provider}",
        request_id=request_id,
        role=RoleEnum.system,
    )


@router.put("/{id}", response_model=GenerationPublic)
def update_generation(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    generation_in: UpdateGenerationRequest,
) -> Any:
    """
    Update a Generation.
    """
    generation = session.get(Generation, id)
    if not generation:
        raise HTTPException(status_code=404, detail="Canvas not found")
    if not current_user.is_superuser and (generation.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    generation_data = generation_in.model_dump(exclude_unset=True)

    generation.sqlmodel_update(generation_data)
    session.add(generation)
    session.commit()
    session.refresh(generation)
    return generation


@router.delete("/{id}")
def delete_generation(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a Generation.
    """
    generation = session.get(Generation, id)
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")
    if not current_user.is_superuser and (generation.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(generation)
    session.commit()
    return Message(message="Generation deleted successfully")


@router.post("/webhook/fal")
async def fal_webhook(*, session: SessionDep, request: Request) -> Any:
    payload = await request.json()  # the payload from the request
    request_id = payload.get("request_id")  # the request_id
    inner_payload = payload.get("payload", {})  # the inner_payload from the request
    images = inner_payload.get("images")  # the images from the request

    # check if request_id and image_urls are present
    if not request_id or not images:
        return Message(message="Missing request_id or image_urls")

    # get the generation from the database using the request_id
    generation = session.exec(
        select(Generation).where(Generation.request_id == request_id)
    ).first()

    # if the generation is not found, return an error
    if not generation:
        return Message(message="Generation not found")

    saved_image_urls = []
    thumnail_made = False
    for img in images:
        try:
            url = img.get("url", "")
            width = img.get("width", 0)
            height = img.get("height", 0)
            file_size = img.get("file_size", 0)
            # download the image
            response = requests.get(url)
            response.raise_for_status()
            # get the image bytes
            image_bytes: bytes = response.content

            # generate thumbnail
            if not thumnail_made:
                try:
                    thumbnail_bytes = create_thumbnail(image_bytes=image_bytes)
                    generation.thumbnail = thumbnail_bytes
                    thumnail_made = True
                except Exception as e:
                    return Message(message=f"Failed to generate thumbnail: {e}")
            # upload the image to R2
            r2_url = upload_image_bytes(
                prefix=f"{generation.id}/", image_bytes=image_bytes
            )
            # add the image url to the database
            session.add(
                Image(
                    generation_id=generation.id,
                    image_url=r2_url,
                    file_size=file_size,
                    width=width,
                    height=height,
                    owner_id=generation.owner_id,
                )
            )

            saved_image_urls.append(r2_url)

        except Exception as e:
            return Message(message=f"Failed to process image from {url}: {e}")
    generation.status = "completed"
    session.add(generation)
    session.commit()
    return {"status": "ok"}


@router.post("/images", response_model=ImageGenerationsPublic)
def read_images(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Get all images for a user.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Image)
        count = session.exec(count_statement).one()
        statement = select(Image).offset(skip).limit(limit)
        generations = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Image)
            .where(Image.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Image)
            .where(Image.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        generations = session.exec(statement).all()

    return ImageGenerationsPublic(data=generations, count=count)
