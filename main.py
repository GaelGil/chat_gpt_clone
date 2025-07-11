import os
from llm.ModelClient import ModelClient
from llm.Model import Model
from openai import OpenAI
from Agent import Agent
from utils.tools import TOOLS
from utils.tool_defenitions import TOOL_DEFENITIONS

if __name__ == "__main__":
    client: OpenAI = ModelClient(key=os.getenv('OPENAI_API_KEY')).get_client()

    llm: Model = Model(client=client,
                       model_name='gpt-4.1-mini',
                       tools=TOOL_DEFENITIONS
                        )
    
    agent: Agent = Agent(model=llm, tools=TOOLS)
    # agent.start()

