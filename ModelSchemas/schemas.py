from pydantic import BaseModel, Field
from typing import List


class PlanStep(BaseModel):
    """Represents a single step in a plan."""

    id: int = Field(description="Unique identifier for the step")
    type: str = Field(
        description="Type of the step, e.g., 'research', 'write', 'review'"
    )
    description: str = Field(description="Description of the step")
    tools_needed: List[str] = Field(
        description="List of tools needed to complete this step"
    )


class PlanOutput(BaseModel):
    goal: str = Field(description="The overall goal of the plan")
    setps: List[PlanStep] = Field(description="List of steps to achieve the goal")


class ResearchResponse(BaseModel):
    """Response from the research tool."""

    tool_used: str = Field(description="Name of the tool used for research")
    content: str = Field(description="Content returned by the research tool")


class EssaySection(BaseModel):
    """Content for the essay writing tool."""

    type: str = Field(
        description="Type of content, for the essay ie introduction, body, conclusion"
    )
    content: str = Field(description="The content of the essay section")
    references: List[str] = Field(description="List of references used in the essay")
