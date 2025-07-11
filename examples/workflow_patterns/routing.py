import os
import logging
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from openai import OpenAI
load_dotenv(Path('../../.env'))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
model = 'gpt-4.1-mini'

class CalendarRequestType(BaseModel):
    """Router LLM call: Determine the type of calendar request"""
    request_type: Literal['new_event', 'modify_event', 'other'] = Field(description='Type of calendar request being made')
    confidence_score: float = Field(description='Confidence score between 0 and 1')
    description: str = Field(description='Cleaned description of the request')

class NewEventDetails(BaseModel):
    """Details for creating a new event"""
    name: str = Field(description='Name of event')
    date: str = Field(description='Date and Time of the event (ISO 8601)')
    duration_minutes: int = Field(description='Duration in minutes')
    participants: list[str] = Field(description='List of participants')

class Change(BaseModel):
    """Details for changing an existing event"""
    field: str = Field(description='Field to change')
    new_value: str = Field(description='New value for the field')

class ModifyEventDetails(BaseModel):
    """Details for modifying an existing event"""
    event_identifier: str = Field(description='Description to identify the existing event')
    changes: list[Change] = Field(description='List of changes to make')
    participants_to_add: list[str] = Field(description='New participants to add')
    participants_to_remove: list[str] = Field(description='Participants to remove')


class CalendarResponse(BaseModel):
    """Final Response format"""
    sucess: bool = Field(description='whether the operation was successful')
    message: str = Field(description='User friendly response message')
    calendar_link: Optional[str] = Field(description='Calendar link if applicable')



def route_calendar_request(user_input: str) -> CalendarRequestType:
    """Router LLM call to determine"""
    return CalendarRequestType