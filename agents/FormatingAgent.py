from mcp.client import ClientSession


class FormattingAgent:
    def __init__(self, session: ClientSession):
        self.session = session

    async def format_schedule(self, schedule: dict) -> str:
        """
        Format schedule dict into text or generate PDF.
        You can call tools here that do formatting or PDF generation.
        """
        formatted_text = await self.session.call_tool("format_schedule_text", schedule)

        # Alternatively, call a PDF generator tool and return path or binary data
        # pdf_path = await self.session.call_tool("generate_schedule_pdf", schedule)

        return formatted_text
