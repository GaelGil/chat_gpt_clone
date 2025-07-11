import os
import logging
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional
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



# define models

class EventExtraction(BaseModel):
    """For First LLM call: Extract basic event information"""
    description: str = Field(description='Raw description of the event')
    is_calender_event: bool = Field(description='Wheter this event is a calendar event')
    confidence_score: float = Field(description='Confidence score between 0 and 1')


class EventDetails(BaseModel):
    """For Second LLM call: Parse specific event details"""
    name: str = Field(description='Name of event')
    date: str = Field(description='Date and time of the event. Use ISO 8601 to format this value.')
    duration_time: int = Field(description='Expected duration in minutes')
    participants: list[str] = Field(description='List of participants')

class EventConfirmation(BaseModel):
    """For Third LLM call"""
    confirmation_message: str = Field(description='Natural language confirmation message')
    calendar_link: Optional[str] = Field(description='Generated calendar link if applicable')


def extract_event_info(user_input: str) -> EventExtraction:
    """First LLM call to determine if input is a calendar event"""
    logger.info('Starting evnet extraction analysis')
    logger.debug(f'Input text: {user_input}')
    today = datetime.now()
    date_context = f'Today is {today.strftime('%A, %B %d, %Y')}'

    response = client.responses.parse(
        model=model,
        input=[
            {
                'role': 'developer',
                'content': f'{date_context} Analyze if the text describes a calendar event.'
            },
            {
                'role': 'user',
                'content': user_input
            }
            ],
            text_format=EventExtraction
    )

    result = response.output_parsed
    logger.info(f'Extraction Complete - Is calendar event: {result.is_calender_event}, Confidence: {result.confidence_score}')
    return result


def parse_event_details(description: str) -> EventDetails:
    """Second LLM call to extract specific event details"""
    logger.info('Starting event details parsing')
    today = datetime.now()
    date_context = f'Today is {today.strftime('%A, %B %d, %Y')}.'
    response = client.responses.parse(
        model=model,
        input=[
            {
                'role': 'developer',
                'content': f'{date_context} Extract detailed event information. When dates reference "next Tuesday" or similar relative dates, use this current date as reference.'
            },
            {
                'role': 'user',
                'content': description
            }
        ],
        text_format=EventDetails
    )

    result = response.output_parsed
    logger.info(f'Parsed event details - Name: {result.name}, Date: {result.date}, Duration: {result.duration_time}min')
    logger.debug(f'Participants: {', '.join(result.participants)}')
    return result


def generate_confirmation(event_details: EventDetails) -> EventConfirmation:
    """Third LLM call to generate a confirmation messsage"""
    logger.info('Generating confirmation message')
    response = client.responses.parse(
        model=model,
        input=[
            {
                'role': 'developer',
                'content': 'Generate a natural confirmation message for the event'
            },
            {
                'role': 'user',
                'content': str(event_details.model_dump())
            }
        ],
        text_format=EventConfirmation
    )
    result = response.output_parsed
    logger.info('Confirmation message generated successfully')
    return result


def process_calendar_request(user_input: str) ->Optional[EventConfirmation]:
    """main function implementing the prompt chain with gate check"""
    logger.info('Proccessing calendar request')
    logger.debug(f'Raw input: {user_input}')

    inital_extraction:EventExtraction = extract_event_info(user_input=user_input)
    if (not inital_extraction.is_calender_event or inital_extraction.confidence_score < 0.7):
        logger.warning(f'Gate check failed = is_calendar_invite: {inital_extraction.is_calender_event}, confidence_score {inital_extraction.confidence_score}')
        return None
    logger.info('Gate check passed, proceeding with event parsing')
    event_details: EventDetails = parse_event_details(inital_extraction.description)
    confirmation: EventConfirmation = generate_confirmation(event_details=event_details)
    logger.info('Calendar request processing completed successfully')
    return confirmation

# valid request 
user_input = "Let's schedule a 1h team meeting next Tuesday at 2pm with Alice and Bob to discuss the project roadmap."
result = process_calendar_request(user_input=user_input)
if result:
    print(f'Confirmation: {result.confirmation_message}')
    if result.calendar_link:
        print(f'Calendar link: {result.calendar_link}')
else:
    print("This doesn't appear to be a calendar event request.")

# not a valid request
user_input = "Can you send an email to Alice and Bob to discuss the project roadmap?"

result = process_calendar_request(user_input)
if result:
    print(f"Confirmation: {result.confirmation_message}")
    if result.calendar_link:
        print(f"Calendar Link: {result.calendar_link}")
else:
    print("This doesn't appear to be a calendar event request.")