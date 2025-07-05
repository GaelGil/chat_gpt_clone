from llm.Model import Model
from openai.types.chat.chat_completion import ChatCompletion


class Agent:
    def __init__(self, model: Model) -> None:
        """Function to initlize a agent instance
        Args:
            model: The llm model we are going to use

        Returns: 
            None
        """
        self.model = model
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

    def call_model(self) -> ChatCompletion:
        return self.model.call_model()

    def get_input(self) -> None:
        """
        """
        topic: str = input('Please the topic for the outline')
        self.model.set_user_query({
            "role": "user",
            "content": topic
            })

    def start(self) -> None:
        """Function to start the agents tasks/process
        """
        self.set_working(True)
        self.get_input()
        response: ChatCompletion = self.call_model()
        print(response)
        # action = self.parse_response()
        # if action:
        #     return


