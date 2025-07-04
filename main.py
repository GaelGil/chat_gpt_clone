from .llm.ModelClient import ModelClient
from .llm.Model import Model
from config import BASE_URL, API_KEY, PROMPT, MODEL_NAME
from Agent import Agent

if __name__ == "__main__":
    client: ModelClient = ModelClient(url=BASE_URL, key=API_KEY)
    llm: Model = Model(client=client, model_name=MODEL_NAME)

    PROMPT['content'] = 'general prompt for the llm'

    llm.set_prompt()

    agent = Agent(model=llm, tools=[], goal='')
    

