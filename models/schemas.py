from pydantic import BaseModel
from typing import List, Optional


class EssayIntroduction(BaseModel):
    content: str
    sources: Optional[str]
    main_topic: str


class EssayBody(BaseModel):
    content: str
    references: Optional[List[str]]


class EssayConclusion(BaseModel):
    summary: str
    insights: Optional[str]


class ReviewedDocument(BaseModel):
    final_text: str
    notes: Optional[str]
    next_steps: Optional[str]


class PlanOutput(BaseModel):
    steps: List[str]


class SectionOutput(BaseModel):
    text: str


class ReviewOutput(BaseModel):
    polished_text: str
    issues_found: bool


class EssayPlan(BaseModel):
    plans: List[str]


class SectionDetails(BaseModel):
    name: str
    content: str
    sources: Optional[List[str]] = None
    tools_used: Optional[List[str]] = None
