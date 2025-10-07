# import base64
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, EmailStr  # , field_serializer
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    canvases: list["Canvas"] = Relationship(back_populates="owner", cascade_delete=True)
    generations: list["Generation"] = Relationship(
        back_populates="owner", cascade_delete=True
    )


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class CanvasBase(SQLModel):
    title: str | None = Field(default=None, max_length=255)


class NewCanvasRequest(CanvasBase):
    pass


class UpdateCanvasRequest(CanvasBase):
    title: str | None = Field(default=None, max_length=255)


class Canvas(CanvasBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="canvases")
    created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)
    generations: list["Generation"] = Relationship(
        back_populates="canvas", cascade_delete=True
    )
    # history: list["CanvasHistory"] = Relationship(
    #     back_populates="canvas", cascade_delete=True
    # )


# class CanvasHistory(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     canvas_id: uuid.UUID = Field(
#         foreign_key="canvas.id", nullable=False, ondelete="CASCADE"
#     )
#     old_prompt: str = Field(default=None, max_length=255, nullable=False)
#     canvas: Canvas | None = Relationship(back_populates="history")
#     created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)


# class CanvasHistoryPublic(SQLModel):
#     id: uuid.UUID
#     canvas_id: uuid.UUID
#     old_prompt: str
#     created_at: datetime


class CanvasPublic(CanvasBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class CanvasesPublic(SQLModel):
    data: list[CanvasPublic]
    count: int


class GenerationStatus(str, Enum):
    pending: str = "pending"
    completed: str = "completed"
    failed: str = "failed"


class GenerationBase(SQLModel):
    prompt: str | None = Field(default=None, max_length=255)
    cost: Decimal | None = Field(default=0.05, nullable=False)
    provider: str | None = Field(default=None, max_length=255)
    model: str | None = Field(default=None, max_length=255)
    num_images: int | None = Field(default=None, nullable=False)
    image_size: str | None = Field(default=None, max_length=255)
    status: GenerationStatus = Field(default=GenerationStatus.pending, nullable=False)


class NewGenerationRequest(GenerationBase):
    canvas_id: uuid.UUID


class RoleEnum(str, Enum):
    user = "user"
    system = "system"


class NewGenerationResponse(BaseModel):
    message: str
    request_id: str
    role: RoleEnum


class UpdateGenerationRequest(GenerationBase):
    pass


class Generation(GenerationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="generations")
    canvas_id: uuid.UUID = Field(
        foreign_key="canvas.id", nullable=False, ondelete="CASCADE"
    )
    canvas: Canvas | None = Relationship(back_populates="generations")
    created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)
    images: list["Image"] = Relationship(
        back_populates="generation", cascade_delete=True
    )
    thumbnail: bytes | None = Field(default=None, nullable=True)
    request_id: str | None = Field(default=None, max_length=255)


class Image(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    generation_id: uuid.UUID = Field(
        foreign_key="generation.id", nullable=False, ondelete="CASCADE"
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    image_url: str | None = Field(max_length=255, nullable=False)
    file_size: int | None = Field(nullable=False)
    width: int | None = Field(nullable=False)
    height: int | None = Field(nullable=False)
    generation: Generation | None = Relationship(back_populates="images")
    created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)


class GenerationPublic(GenerationBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    status: GenerationStatus
    # # optional since we have the thmbnail at the moment of creation
    # thumbnail: bytes | None

    # @field_serializer("thumbnail")
    # def encode_thumbnail(self, thumbnail: bytes | None, _info):
    #     if thumbnail:
    #         return base64.b64encode(thumbnail).decode("utf-8")
    #     return None


class GenerationsPublic(SQLModel):
    data: list[GenerationPublic]
    count: int


class ImageGenerationPublic(SQLModel):
    id: uuid.UUID
    image_url: str
    created_at: datetime
    generation_id: uuid.UUID


class ImageGenerationsPublic(SQLModel):
    data: list[ImageGenerationPublic]
    count: int


class GenerationData(GenerationPublic):
    created_at: datetime
    # count: int
    images: list[ImageGenerationPublic]


class ProviderInput(SQLModel):
    prompt: str
    model: str
    num_images: int
    image_size: str | None = None


class ImagesData(SQLModel):
    data: list[ImageGenerationPublic]
    count: int


class GenerationsData(GenerationBase):
    data: list[GenerationData]


class CanvasData(CanvasPublic):
    generations: list[GenerationData]
    created_at: datetime
