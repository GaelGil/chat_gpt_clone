from .llm.Model import Model
from openai.types.chat.chat_completion import ChatCompletion


class Agent:
    def __init__(self, model: Model, tools: list, goal: str, prompt:str) -> None:
        """Function to initlize a agent instance
        Args:
            model: The llm model we are going to use
            tools: the tools that our llm model can call
            goal: the goal of our ai agent

        Returns: 
            None
        """
        self.model = model
        self.tools = tools
        self.goal = goal
        self.prompt = prompt
        self.working = False

    def set_working(self, working: bool) -> None:
        """Function to set the value of working or not working
        Args: 
            working: a true or false value

        Returns:
            None
        """
        self.working = working

    def parse_response(self, response: ChatCompletion) -> None:
        pass

    def call_model()

    def start(self) -> None:
        """Function to start the agents tasks/process
        """
        self.set_working(True)
        topic: str = input('Please enter what you want to research: ')
        response: ChatCompletion = self.model.query(topic)
        action = self.parse_response()
        if action:
            


