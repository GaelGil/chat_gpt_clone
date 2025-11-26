from sqlmodel import Field, SQLModel


class SessionBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    pass
