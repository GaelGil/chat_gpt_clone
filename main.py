from .llm.ModelClient import ModelClient
from .llm.Model import Model
from utils.config import CONFIG
from Agent import Agent

if __name__ == "__main__":
    client: ModelClient = ModelClient(url=CONFIG['BASE_URL'], key=CONFIG['API_KEY'])
    llm: Model = Model(client=client, model_name=CONFIG['MODEL_NAME'])

    tools = []
    output_format = ''
    function_call = {'call': 'tool.name'}
    CONFIG['PROMPT'] = f"""
    You are an AI assistant tasked with {CONFIG['GOAL']} with these {tools} to help. You must help the user with
    whatever question/task they need. You must resturn the your output in this forrmat {output_format}.
    If you need to call a function simply return {function_call}
    """

    agent = Agent(model=llm, tools=tools, goal=CONFIG['GOAL'])
    agent.model.set_prompt(prompt=CONFIG['PROMPT'])
    agent.start()

