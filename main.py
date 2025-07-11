import os
from llm.ModelClient import ModelClient
from llm.Model import Model
from openai import OpenAI
from Agent import Agent
from utils.tools import TOOLS
from utils.tool_defenitions import TOOL_DEFINITIONS

if __name__ == "__main__":
    client: OpenAI = ModelClient(key=os.getenv('OPENAI_API_KEY')).get_client()
    # gpt-4.1-mini
    # CONFIG['PROMPT'] = f"""
    # You are an AI assistant tasked with {CONFIG['GOAL']}. You have tools available here {TOOL_DEFINITIONS} to get things done.
    # You must help the user with whatever question/task they need.
    # """

    # llm: Model = Model(client=client,
    #                     prompt= {"role": "assistant",
    #                                     "content": CONFIG['PROMPT']
    #                                     },
    #                     tools=TOOL_DEFINITIONS,
    #                     model_name=CONFIG['MODEL_NAME'])
    
    # agent: Agent = Agent(model=llm, functions=TOOL_REGISTRY)
    # agent.start()

