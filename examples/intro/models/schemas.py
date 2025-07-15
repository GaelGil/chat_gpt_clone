from pydantic import BaseModel, Field


class KBResponse(BaseModel):
    answer: str = Field(description="The answer to the users question")
    source: int = Field(description="The record id of the answer")


class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]
