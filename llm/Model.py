from openai import OpenAI

class Model:
    """
    """

    def __init__(self, client: OpenAI) -> None:
        """ Function to initiliaze a
        """
        self.client = client


    def query(self, user_query: str) -> None:
        """
        Function send a query to a llm

        Args: 
            user_query: the query that the user has inputed

        Returns:
            None for now
        """
        pass

