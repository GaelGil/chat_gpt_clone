from .llm.Model import Model

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


    def set_prompt(self):
        self.model.set_prompt(self.prompt)