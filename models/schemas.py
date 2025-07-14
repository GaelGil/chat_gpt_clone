from pydantic import BaseModel
from typing import List, Optional


class Introduction(BaseModel):
    content: str
    sources: Optional[str]
    main_topic: str


class Body(BaseModel):
    content: str
    references: Optional[List[str]]


class Conclusion(BaseModel):
    summary: str
    insights: Optional[str]


class ReviewedDocument(BaseModel):
    final_text: str
    notes: Optional[str]
    next_steps: Optional[str]
