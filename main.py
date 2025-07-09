from llm.ModelClient import ModelClient
from llm.Model import Model
from openai import OpenAI
from utils.config import CONFIG
from Agent import Agent
from utils.tools import TOOL_REGISTRY, TOOL_DEFINITIONS

if __name__ == "__main__":
    client: OpenAI = ModelClient(url=CONFIG['BASE_URL'], key=CONFIG['API_KEY']).get_client()
    CONFIG['PROMPT'] = f"""
    You are an AI assistant tasked with {CONFIG['GOAL']}. You have tools available here {TOOL_DEFINITIONS} to get things done.
    You must help the user with whatever question/task they need.
    """

    llm: Model = Model(client=client,
                        system_prompt= {"role": "assistant",
                                        "content": CONFIG['PROMPT']
                                        },
                        tools=TOOL_DEFINITIONS,
                        model_name=CONFIG['MODEL_NAME'])
    
    agent: Agent = Agent(model=llm, functions=TOOL_REGISTRY)
    agent.start()

