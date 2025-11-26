from sqlmodel import Field, SQLModel


class MessageBase(SQLModel):
    role: str = Field(max_length=255, nullable=False)
    message: str = Field(max_length=255, nullable=False)
