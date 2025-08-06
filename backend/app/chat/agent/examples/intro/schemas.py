from pydantic import BaseModel, Field


class KBResponse(BaseModel):
    answer: str = Field(description="The answer to the users question")
    source: int = Field(description="The record id of the answer")


class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]


class WeatherResponse(BaseModel):
    temperature: float = Field(
        description="The current temperature in celsius for the given location."
    )
    response: str = Field(
        description="A natural language response to the user's question."
    )
