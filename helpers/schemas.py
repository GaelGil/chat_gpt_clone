from pydantic import BaseModel, Field


class DecideResposnse(BaseModel):
    thoughts: list[str] = Field(description="List of thoughts")
    selected_tools: list[dict] = Field(description="List of selected tools")
