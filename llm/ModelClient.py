from openai import OpenAI

class ModelClient:
    """
    """

    def __init__(self, url: str, key: str):
        self.client = OpenAI(base_url=url, api_key=key)
        pass


    def get_client(self) -> OpenAI:
        return self.client


# # Simplified mock function to call your LLaMA model, replace with your actual llama call
# def llama_generate(prompt: str) -> str:
#     # This function sends prompt to LLaMA and returns the text output
#     # Replace with your real llama inference code
#     print(f"Prompt to LLaMA:\n{prompt}\n")
#     # Example structured output from LLaMA
#     return """
#     {
#       "action": "search_flights",
#       "parameters": {
#         "from": "NYC",
#         "to": "Paris"
#       }
#     }
#     """

# # Define your external tools (APIs, DBs, functions)
# def search_flights(from_city: str, to_city: str):
#     # Pretend to query a flights API
#     print(f"Searching flights from {from_city} to {to_city}...")
#     return ["Flight 1", "Flight 2", "Flight 3"]

# def book_flight(flight_id: str):
#     print(f"Booking flight {flight_id}...")
#     return "Booking confirmed!"

# # Agent loop
# def ai_agent(goal: str, max_steps=5):
#     context = f"Goal: {goal}\n"
    
#     for step in range(max_steps):
#         # Build prompt with current context
#         prompt = f"""
# You are an AI agent. Your goal is: {goal}
# Based on this goal and the current context, decide on the next action.
# Respond in JSON format like:
# {{
#   "action": "<action_name>",
#   "parameters": {{ <parameters> }}
# }}

# Current context:
# {context}
# """
#         # Ask LLaMA for next action
#         response = llama_generate(prompt)
        
#         # Parse the JSON output (simplified, you want proper error handling)
#         import json
#         try:
#             decision = json.loads(response)
#             action = decision.get("action")
#             params = decision.get("parameters", {})
#         except json.JSONDecodeError:
#             print("Failed to parse LLaMA response, stopping.")
#             break
        
#         # Execute the action
#         if action == "search_flights":
#             flights = search_flights(params.get("from"), params.get("to"))
#             context += f"Found flights: {flights}\n"
        
#         elif action == "book_flight":
#             result = book_flight(params.get("flight_id"))
#             context += f"Booking result: {result}\n"
#             print("Goal achieved!")
#             break
        
#         else:
#             print(f"Unknown action: {action}, stopping.")
#             break
    
#     print("Agent finished. Final context:")
#     print(context)

# # Example usage
# if __name__ == "__main__":
#     ai_agent("Book a flight from NYC to Paris")
