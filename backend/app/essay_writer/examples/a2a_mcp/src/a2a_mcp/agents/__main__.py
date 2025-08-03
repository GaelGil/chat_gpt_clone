# type: ignore

import json
import logging
import sys

from pathlib import Path

import click
import httpx
import uvicorn

from a2a.server.apps import A2AStarletteApplication
from a2a.server.events import InMemoryQueueManager
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import (
    BasePushNotificationSender,
    InMemoryPushNotificationConfigStore,
    InMemoryTaskStore,
)
from a2a.types import AgentCard
from ..common import prompts
from ..common.agent_executor import GenericAgentExecutor
from .EssayAgent import EssayAgent
from .LangraphPlannerAgent import LangraphPlannerAgent
from .OrchestratorAgent import OrchestratorAgent


logger = logging.getLogger(__name__)


def get_agent(agent_card: AgentCard):
    """Get the agent, given an agent card."""
    try:
        print(f"DEBUG: Creating agent for card: {agent_card.name}")

        if agent_card.name == "orchestrator_agent":
            print("DEBUG: Initializing Orchestrator Agent")
            return OrchestratorAgent()
        if agent_card.name == "planner_agent":
            print("DEBUG: Initializing Planner Agent")
            return LangraphPlannerAgent()
        if agent_card.name == "code_search_agent":
            print("DEBUG: Initializing Code Search Agent")
            return EssayAgent(
                agent_name="code_search_agent",
                description="Performs semantic code search and analysis across codebases",
                instructions=prompts.CODE_SEARCH_INSTRUCTIONS,
            )
        if agent_card.name == "essay_review_agent":
            print("DEBUG: Initializing Essay Review Agent")
            return EssayAgent(
                agent_name="essay_review_agent",
                description="Performs static essay analysis and essay quality assessment",
                instructions=prompts.CODE_ANALYSIS_INSTRUCTIONS,
            )
        if agent_card.name == "essay_section_writer_agent":
            print("DEBUG: Initializing Essay Section Writer Agent")
            return EssayAgent(
                agent_name="essay_section_writer_agentt",
                description="Analyses notes on topic to create a section in an essay",
                instructions=prompts.CODE_DOCUMENTATION_INSTRUCTIONS,
            )
    except Exception as e:
        print(f"DEBUG: Error creating agent: {e}")
        print(f"DEBUG: Error type: {type(e)}")
        import traceback

        print(f"DEBUG: Traceback: {traceback.format_exc()}")
        raise e


@click.command()
@click.option("--host", "host", default="localhost")
@click.option("--port", "port", default=10101)
@click.option("--agent-card", "agent_card")
def main(host, port, agent_card):
    """Starts an Agent server."""
    try:
        print(f"DEBUG: Starting agent server with card: {agent_card}")

        if not agent_card:
            raise ValueError("Agent card is required")

        print(f"DEBUG: Reading agent card file: {agent_card}")
        with Path.open(agent_card) as file:
            data = json.load(file)
        agent_card = AgentCard(**data)
        print(f"DEBUG: Agent card loaded successfully: {agent_card.name}")

        print("DEBUG: Creating httpx client")
        client = httpx.AsyncClient()

        print("DEBUG: Creating configuration stores")
        config_store = InMemoryPushNotificationConfigStore()

        print("DEBUG: Getting agent instance")
        agent_instance = get_agent(agent_card)
        print("DEBUG: Agent instance created successfully")

        print("DEBUG: Creating request handler")
        request_handler = DefaultRequestHandler(
            agent_executor=GenericAgentExecutor(agent=agent_instance),
            task_store=InMemoryTaskStore(),
            queue_manager=InMemoryQueueManager(),
            push_config_store=config_store,
            push_sender=BasePushNotificationSender(client, config_store),
        )
        print("DEBUG: Request handler created successfully")

        print("DEBUG: Creating A2A server application")
        server = A2AStarletteApplication(
            agent_card=agent_card, http_handler=request_handler
        )
        print("DEBUG: A2A server application created successfully")

        logger.info(f"Starting server on {host}:{port}")
        print(f"DEBUG: Starting uvicorn server on {host}:{port}")

        uvicorn.run(server.build(), host=host, port=port)
        print("DEBUG: Server started successfully")
    except FileNotFoundError:
        logger.error(f"Error: File '{agent_card}' not found.")
        sys.exit(1)
    except json.JSONDecodeError:
        logger.error(f"Error: File '{agent_card}' contains invalid JSON.")
        sys.exit(1)
    except Exception as e:
        logger.error(f"An error occurred during server startup: {e}")
        print(f"DEBUG: Server startup failed with error: {e}")
        print(f"DEBUG: Error type: {type(e)}")
        import traceback

        print(f"DEBUG: Full traceback: {traceback.format_exc()}")
        sys.exit(1)


if __name__ == "__main__":
    main()
