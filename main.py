from dotenv import load_dotenv
from pathlib import Path
import asyncio
import os
from MCP.client import MCPClient
from Agents.OrchestratorAgent import OrchestratorAgent
from Agents.ReviewAgent import ReviewAgent
from Agents.ResearchAgent import ResearchAgent
from Agents.SectionAgent import SectionAgent
from Agents.ResponseAgent import ResponseAgent
from Prompts import AgentPrompts
from Models.LLM import LLM


load_dotenv(Path("./.env"))


async def execute():
    client = MCPClient()  # start client

    await client.connect()  # connect to client

    model = LLM(model_name="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))

    orchestrator = OrchestratorAgent(
        model=model, dev_prompt=AgentPrompts.ORCHESTRATOR_PROMPT
    )
    researcher = ResearchAgent(model=model, dev_prompt=AgentPrompts.RESEARCH_PROMPT)
    responder = ResponseAgent(model=model, dev_prompt=AgentPrompts.RESPONSE_PROMPT)
    reviewer = ReviewAgent(model=model, dev_prompt=AgentPrompts.REVIEW_PROMPT)
    section = ReviewAgent(model=model, dev_prompt=AgentPrompts.SECTION_PROMPT)

    available_agents = {"agent"}

    orchestrator.run(agents=[researcher, responder, reviewer, section])


if __name__ == "__main__":
    asyncio.run(execute())
