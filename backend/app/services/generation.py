# from app.models.generation import Generation

from app.providers.FalProvider import FalProvider


class GenerationService:
    def __init__(self):
        self.providers = {
            "fal": FalProvider(),
            # "stability": StabilityProvider(),   # later
        }

    async def start_generation(self, **kwargs):
        """Start a new generation using the chosen provider"""

        prov = self.providers[kwargs.get("provider", "fal")]

        return await prov.generate(**kwargs)
