from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from openai import OpenAI


load_dotenv()

llm = OpenAI(
    base_url="http://localhost:8080/v1", 
    api_key = "sk-no-key-required"
)

response = llm.invokte("what is the meaing of life?")
print(response)