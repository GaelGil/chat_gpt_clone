# main_agent.py
import asyncio
from mcp.client import Client
from agents.InputProcessingAgent import InputProcessingAgent
from PlanningAgent import PlanningAgent
from FormatingAgent import FormattingAgent


async def main():
    async with Client("http://localhost:8600/sse") as session:
        input_agent = InputProcessingAgent(session)
        planning_agent = PlanningAgent(session)
        formatting_agent = FormattingAgent(session)

        raw_inputs = {
            "desired_classes": ["Math101", "Physics101"],
            "required_classes": ["English101"],
            "available_classes": ["Math101", "Physics101", "English101", "History101"],
            "time_constraints": {"monday": ["9am-12pm"], "wednesday": ["2pm-5pm"]},
        }

        processed_inputs = await input_agent.process_inputs(raw_inputs)
        schedule = await planning_agent.create_schedule(processed_inputs)
        formatted_schedule = await formatting_agent.format_schedule(schedule)

        print("Here is your formatted schedule:\n")
        print(formatted_schedule)


if __name__ == "__main__":
    asyncio.run(main())
