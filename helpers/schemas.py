from pydantic import BaseModel, Field, List


class DecideResposnse(BaseModel):
    thoughts: list[str] = Field(description="List of thoughts")
    selected_tools: list[dict] = Field(description="List of selected tools")


class ToolHistoryResponse(BaseModel):
    question: str
    called_tools: List[dict]
