from pydantic import BaseModel, Field


class ActionOutput(BaseModel):
    action: str = Field(description="The action to take next")
