import os
import logging
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional, Literal
from pydantic import BaseModel, Field
from openai import OpenAI

load_dotenv(Path("../../.env"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model = "gpt-4.1-mini"


# define model
class CalendarRequestType(BaseModel):
    """Router LLM call: Determine the type of calendar request"""

    request_type: Literal["new_event", "modify_event", "other"] = Field(
        description="Type of calendar request being made"
    )
    confidence_score: float = Field(description="Confidence score between 0 and 1")
    description: str = Field(description="Cleaned description of the request")


class NewEventDetails(BaseModel):
    """Details for creating a new event"""

    name: str = Field(description="Name of event")
    date: str = Field(description="Date and Time of the event (ISO 8601)")
    duration_minutes: int = Field(description="Duration in minutes")
    participants: list[str] = Field(description="List of participants")


class Change(BaseModel):
    """Details for changing an existing event"""

    field: str = Field(description="Field to change")
    new_value: str = Field(description="New value for the field")


class ModifyEventDetails(BaseModel):
    """Details for modifying an existing event"""

    event_identifier: str = Field(
        description="Description to identify the existing event"
    )
    changes: list[Change] = Field(description="List of changes to make")
    participants_to_add: list[str] = Field(description="New participants to add")
    participants_to_remove: list[str] = Field(description="Participants to remove")


class CalendarResponse(BaseModel):
    """Final Response format"""

    sucess: bool = Field(description="whether the operation was successful")
    message: str = Field(description="User friendly response message")
    calendar_link: Optional[str] = Field(description="Calendar link if applicable")


# define functions to handle events
def route_calendar_request(user_input: str) -> CalendarRequestType:
    """Router LLM call to determine the type of calendar request"""
    logger.info("Routing calendar request")
    response = client.responses.parse(
        model=model,
        input=[
            {
                "rolte": "developer",
                "content": "Determine if this is a request to create a new calendar event or modify an existing one",
            },
            {"role": "user", "content": user_input},
        ],
        text_format=CalendarRequestType,
    )
    result = response.output_parsed
    logger.info(f"Request routed as: {result.request_type}")
    return result


def handle_new_event(description: str) -> CalendarResponse:
    """Process a new event request"""
    logger.info("Processing a new event request")
    response = client.responses.parse(
        model=model,
        input=[
            {
                "rolte": "developer",
                "content": "Extract details for creating a new calendar event",
            },
            {"role": "user", "content": description},
        ],
        text_format=NewEventDetails,
    )
    details = response.output_parsed
    if details:
        logger.info(f"New event: {details.model_dump_json(indent=2)}")
        return CalendarResponse(
            sucess=True,
            message=f"Craeted new event {details.name} for {details.date} with {', '.join(details.participants)}",
            calendar_link=f"link/{details.name}",
        )
    else:
        return CalendarResponse(
            sucess=False, message="Was not able to create response", calendar_link=""
        )


def handle_modify_event(description: str) -> CalendarResponse:
    """Process an event modification"""
    logger.info("Processing event modification request")
    response = client.responses.parse(
        model=model,
        input=[
            {
                "role": "developer",
                "content": "Extract details for modifying a existing calendar event",
            },
            {"role": "user", "content": description},
        ],
        text_format=ModifyEventDetails,
    )
    details = response.output_parsed
    if details:
        logger.info(f"Modified event: {details.model_dump_json(indent=2)}")
        return CalendarResponse(
            sucess=True,
            message=f"Modified event {details.event_identifier} with the requested changes",
            calendar_link=f"link/{details.event_identifier}",
        )
    else:
        return CalendarResponse(
            sucess=False, message="Was not able to modify event", calendar_link=""
        )


# function to handle everything
def process_calendar_request(user_input: str) -> Optional[CalendarResponse]:
    """main function implementing the routing workflow"""
    logger.info("Processing calendar request")
    route_result = route_calendar_request(user_input=user_input)
    if route_result.confidence_score < 0.7:
        logger.warning(f"Low confidence score: {route_result.confidence_score}")
        return None
    if route_result.request_type == "new_event":
        return handle_new_event(route_result.description)
    elif route_result.request_type == "modify_event":
        return handle_modify_event(route_result.description)
    else:
        logger.warning("Request type not supported")
        return None


# new event test
new_event_input = 'Let"s schedule a team meeting next Tuesday at 2pm with Alice and Bob'
new_event_res = process_calendar_request(user_input=new_event_input)
if new_event_res:
    print(f"Response: {new_event_res.message}")


# modify_event test
modify_event_input = (
    "Can you move the team meeting with Alice and Bob to Wednesday at 3pm instead?"
)
modify_event_res = process_calendar_request(user_input=modify_event_input)
if modify_event_input:
    print(f"Response: {modify_event_res.message}")

# invalid test
invalid_input = "Whats the weather like today?"
invalid_res = process_calendar_request(user_input=invalid_input)
if not invalid_res:
    print("Request not recognized as a calendar option")
