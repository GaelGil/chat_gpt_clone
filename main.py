from LLM.LLM import LLM
from dotenv import load_dotenv
import os
from Agents.PlannerAgent import PlannerAgent
from Agents.OrchestratorAgent import OrchestatorAgent

load_dotenv()

llm_model = LLM(api_key=os.getenv("OPENAI_API_KEY"))

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
