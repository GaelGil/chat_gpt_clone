from pydantic import BaseModel, Field, List


class DecideResposnse(BaseModel):
    thoughts: list[str] = Field(description="List of thoughts")
    selected_tools: list[dict] = Field(description="List of selected tools")


class CalledToolHistoryResponse(BaseModel):
    question: str = Field(description="The question to answer")
    tools: List[dict] = Field(description="List of tools")
    called_tools: List[dict] = Field(description="List of called tools")
