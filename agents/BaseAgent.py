from abc import ABC, abstractmethod
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    def __init__(self, model_client):
        self.model = model_client

    @abstractmethod
    def run(self, input_data):
        raise NotImplementedError("Subclasses must implement this method.")
