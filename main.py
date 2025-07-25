import os
from LLM.LLM import LLM
from dotenv import load_dotenv
from Agents.PlannerAgent import PlannerAgent
from Agents.OrchestratorAgent import OrchestatorAgent
from MCP.client import MCPClient

load_dotenv()

llm_model = LLM(api_key=os.getenv("OPENAI_API_KEY"))

client = MCPClient()

planner = PlannerAgent(
    dev_prompt="",
    mcp_client=None,
    llm=llm_model,
    messages=[],
    max_turns=3,
    tools=[],
)

orchestrator = OrchestatorAgent(
    dev_prompt="",
    mcp_client=None,
    llm=llm_model,
    messages=[],
    max_turns=3,
    tools=[],
)
