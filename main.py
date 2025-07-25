import os
from LLM.OpenAIModel import OpenAIModel
from dotenv import load_dotenv
from pathlib import Path
from Agents.PlannerAgent import PlannerAgent
from Agents.OrchestratorAgent import OrchestratorAgent
import helpers.prompts as prompts
from MCP.client import MCPClient

load_dotenv(Path("./.env"))

mcp_client = MCPClient()
print(mcp_client.list_tools())
# TODO: connect to client

llm_model = OpenAIModel(api_key=os.getenv("OPENAI_API_KEY"))

planner = PlannerAgent(
    dev_prompt=prompts.PLANNER_AGENT_PROMPT,
    mcp_client=mcp_client,
    llm=llm_model,
    messages=[],
    max_turns=3,
    tools=[],
)

orchestrator = OrchestratorAgent(
    dev_prompt=prompts.ORCHESTRATOR_AGENT_PROMPT,
    mcp_client=mcp_client,
    llm=llm_model,
    messages=[],
    max_turns=3,
    tools=[],
)
