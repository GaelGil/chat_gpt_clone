from langchain_openai import ChatOpenAI 
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_react_agent, AgentExecutor
from langchain.schema import (
    SystemMessage,
    HumanMessage,
    AIMessage,
)
from tools import search_tool
load_dotenv()

class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    tools_used: list[str]

llm = ChatOpenAI(
    openai_api_base="http://localhost:8080/v1",  # Local LLaMA server
    openai_api_key="sk-no-key-required",         # If your server ignores auth
)

parser = PydanticOutputParser(pydantic_object=ResearchResponse)
prompt = ChatPromptTemplate.from_messages([
    ("system",
        """
        You are a research assistant that will help generate a research paper.
        Answer the user query and use necessary tools. 
        Wrap the output in this format and provide no other text:\n{format_instructions}

        You can use the following tools:
        {tools}

        Tool names: {tool_names}
        """),
        ("human", "{input}"),
        ("human", "{agent_scratchpad}"),
]).partial(format_instructions=parser.get_format_instructions())


tools = [search_tool]
agent = create_react_agent(
    tools=tools,
    llm=llm,
    prompt=prompt
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)

# agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
query = input('What can I help you research? ')
raw_response = agent_executor.invoke({'input': query, 'agent_scratchpad': '', 'chat_history': []})
print(raw_response)

# try:
#     structured_response = parser.parse(raw_response.get("output")[0]["text"])
#     print(structured_response)
# except Exception as e:
#     print("Error parsing response", e, "Raw Response - ", raw_response)