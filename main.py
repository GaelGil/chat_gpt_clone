from agents.IntroAgent import IntroAgent
from agents.BodyAgent import BodyAgent
from agents.ConclusionAgent import ConclusionAgent
from agents.ReviewAgent import ReviewAgent
from tools.tool_registry import tools
from agents.PlannerAgent import PlannerAgent
from llm import ModelClient, Model
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()


def run_agentic_essay(topic: str, model: OpenAI, max_iterations: int = 4) -> None:
    planner = PlannerAgent(
        model=model,
        prompt="Given a topic, plan what is needed to write a draft to a essay and save to a txt file",
        tools=tools,
    )

    plan_text = planner.run({"topic": topic})
    steps = [s.strip() for s in plan_text.split("\n") if s.strip()]

    draft = {}
    iter = 0
    while iter < max_iterations:
        iter += 1
        print(f"--- Iteration {iteration} of planning+writing loop ---")

        for step in steps:
            if "intro" in step.lower():
                draft["intro"] = IntroAgent.run({"topic": topic})
            elif "body" in step.lower():
                draft["body"] = BodyAgent.run({"intro_text": draft["intro"]})
            elif "conclusion" in step.lower():
                draft["conclusion"] = ConclusionAgent.run({"body_text": draft["body"]})

        full_text = "\n\n".join(
            [draft[s] for s in ["intro", "body", "conclusion"] if s in draft]
        )
        draft["reviewed"] = ReviewAgent.run({"full_text": full_text})

        # Step 3: Reflect = check coherence, completeness
        critique = planner.run(
            {"topic": topic, "draft": draft["reviewed"], "reflection_step": True}
        )
        if "revise" not in critique.lower():
            break
        print("→ Planner requests revision:", critique)
        plan_text += "\n" + critique  # update plan with critique

    # Step 4: Persist result
    tools["save_to_txt"](filename=f"{topic.replace(' ', '_')}.txt")
    return draft["reviewed"]


if __name__ == "__main__":
    model = ModelClient(api_key=os.getenv("OPENAI_API_KEY")).get_client()

    # PlannerAgent = PlannerAgent(
    #     model=model,
    #     prompt="Given a topic, plan what is needed to write a draft to a essay and save to a txt file",
    #     tools=tools,
    # )

    # IntroAgent = IntroAgent(
    #     model=ModelClient(Model()),
    #     prompt="Write a compelling introduction about: {topic}",
    #     tools=tools,
    # )

    # BodyAgent = BodyAgent(
    #     model=ModelClient(Model()),
    #     prompt="Given this introduction:\n\n{intro_text}\n\nWrite the main body expanding on the topic.",
    #     tools=tools,
    # )

    # ConclusionAgent = ConclusionAgent(
    #     model=ModelClient(Model()),
    #     prompt="Based on this body:\n\n{body_text}\n\nWrite a thoughtful conclusion.",
    #     tools=tools,
    # )

    # ReviewAgent = ReviewAgent(
    #     model=ModelClient(Model()),
    #     prompt="Review and edit the following text for clarity, grammar, and coherence:\n\n{full_text}",
    #     tools=tools,
    # )
