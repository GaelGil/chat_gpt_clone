from .llm.ModelClient import ModelClient
from .llm.Model import Model
from config import BASE_URL, API_KEY

client: ModelClient = ModelClient(url=BASE_URL, key=API_KEY)
llm: Model = Model(client=client)