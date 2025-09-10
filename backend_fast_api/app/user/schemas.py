from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str

    class Config:
        model_config = {
            "from_attributes": True  # <- replaces orm_mode = True
        }
