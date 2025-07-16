from pydantic import BaseModel, Field
from typing import List


class PlanStep(BaseModel):
    """Represents a single step in a plan."""

    id: int = Field(description="Unique identifier for the step")
    description: str = Field(description="Description of the step")
    tools_needed: List[str] = Field(
        description="List of tools needed to complete this step"
    )


class PlanOutput(BaseModel):
    goal: str = Field(description="The overall goal of the plan")
    setps: List[PlanStep] = Field(description="List of steps to achieve the goal")
