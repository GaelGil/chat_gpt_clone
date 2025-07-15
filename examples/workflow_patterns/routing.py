import logging
from examples.Model import LLM
from examples.models.schemas import (
    CalendarRequestType,
    NewEventDetails,
    ModifyEventDetails,
    CalendarResponse,
)
from typing import Optional


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

llm = LLM(model_name="gpt-4.1-mini")


# define functions to handle events
def route_calendar_request(user_input: str) -> CalendarRequestType:
    """Router LLM call to determine the type of calendar request"""
    logger.info("Routing calendar request")
    response = llm.parse_response(
        messages=[
            {
                "role": "developer",
                "content": "Determine if this is a request to create a new calendar event or modify an existing one",
            },
            {"role": "user", "content": user_input},
        ],
        response_format=CalendarRequestType,
    )

    result = response.output_parsed
    logger.info(f"Request routed as: {result.request_type}")
    return result


def handle_new_event(description: str) -> CalendarResponse:
    """Process a new event request"""
    logger.info("Processing a new event request")
    response = llm.parse_response(
        messages=[
            {
                "role": "developer",
                "content": "Extract details for creating a new calendar event",
            },
            {"role": "user", "content": description},
        ],
        response_format=NewEventDetails,
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
    response = llm.parse_response(
        messages=[
            {
                "role": "developer",
                "content": "Extract details for modifying an existing calendar event",
            },
            {"role": "user", "content": description},
        ],
        response_format=ModifyEventDetails,
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
