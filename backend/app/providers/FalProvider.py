import fal_client


class FalProvider:
    async def generate(self, **kwargs):
        """Send a generation request to FAL.ai"""
        model_name = kwargs.pop("model_name", "fal-ai/flux/dev")
        webhook_url = "https://tamayo.fly.dev/api/v1/generation/webhook/fal"
        handler = fal_client.submit(
            model_name,
            arguments=kwargs,
            webhook_url=webhook_url,
        )

        return handler.request_id

    def get_status(self, request_id: str):
        # Use the official client or your own polling logic here
        return self.client.status(request_id)
