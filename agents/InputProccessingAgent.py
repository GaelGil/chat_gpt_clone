from mcp.client import ClientSession


class InputProcessingAgent:
    def __init__(self, session: ClientSession):
        self.session = session

    async def process_inputs(self, raw_inputs: dict) -> dict:
        """
        Validate and normalize inputs like:
        {
          "desired_classes": [...],
          "required_classes": [...],
          "available_classes": [...],
          "time_constraints": {...}
        }
        """
        # Placeholder: You might call tools on the server to validate inputs
        # For now, just return inputs assuming they are valid
        # Example call to tool: await self.session.call_tool("validate_classes", raw_inputs)

        return raw_inputs
