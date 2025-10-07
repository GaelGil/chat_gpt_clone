from typing import Any, Protocol


class ImageProvider(Protocol):
    async def generate(self, prompt: str, **kwargs) -> dict[str, Any]:
        """Start image generation. Returns {request_id, status, cost?}"""

    async def get_status(self, request_id: str) -> dict[str, Any]:
        """Check the status of a generation request."""
