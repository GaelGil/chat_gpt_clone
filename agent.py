from .llm.ModelClient import ModelClient
from .llm.Model import Model
from config import BASE_URL, API_KEY

client: ModelClient = ModelClient(BASE_URL, API_KEY)