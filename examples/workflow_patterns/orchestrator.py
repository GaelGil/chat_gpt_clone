import os
import logging
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from openai import OpenAI

load_dotenv(Path("../../.env"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model = "gpt-4.1-mini"
