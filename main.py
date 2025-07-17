import os
from Model.LLM import LLM
from dotenv import load_dotenv
from pathlib import Path
import asyncio
from ModelSchemas.schemas import PlanOutput, ResearchResponse, EssaySection
from mcp_server_client.client import MCPClient


load_dotenv(Path("./.env"))


async def execute():
    client = MCPClient()
    await client.connect()
    tools = await client.get_tools()
    llm = LLM(model_name="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))
    print(f"Tools: {tools}")
    response = llm.parse_response(
        messages=[
            {
                "role": "developer",
                "content": """
                You are a helpful AI assistant that can write essays, poems, and other creative content. You have access to tools and can use them to assist you in creating content for the essay or poem.
                You can also use the tools to search for information on the topic or best practices for writing essays. Use the tools when necessary to provide the best response. You should plan each part of the essay before writing it.
                For example essays have a certain structure, so you should plan the introduction, body, and conclusion before writing the essay. From there decide what tools to use or next steps to take. Once you are done save the essay to a txt file.
                """,
            },
            {
                "role": "user",
                "content": "Write a thoughtful essay about the cultural impact of star wars. The essay should be at least 500 words long and include references to the original trilogy, the prequels, and the sequels. Include the sources",
            },
        ],
        tools=tools,
        response_format=PlanOutput,
    )

    plans: PlanOutput = response.output_parsed
    print(f"Plans: {plans}")
    for step in plans.setps:
        print(
            f"Step ID: {step.id}, Type: {step.type}, Description: {step.description}, Tools Needed: {step.tools_needed}"
        )
        if step.type == "research":
            # Call the research tool
            research_response = await client.call_tool(
                step.tools_needed[0], step.description
            )
            print(f"Research Response: {research_response}")
            # Assuming the response is a ResearchResponse object
            step_response = ResearchResponse(
                tool_used=step.tools_needed[0], content=research_response
            )
        elif step.type == "write":
            # Call the writing tool
            write_response = await client.call_tool(
                step.tools_needed[0], step.description
            )
            print(f"Write Response: {write_response}")
            # Assuming the response is a string or similar
            # step_response = write_response

        # step_response = llm.parse_response(messages=step.description, tools=tools)


if __name__ == "__main__":
    asyncio.run(execute())  # Run the agent function
    # Initialize the LLM with a model name and API key

    # Example usage of create_response
    # response = llm.create_response(
    #     messages=[
    #         {"role": "developer", "content": "You are a helpful AI assistant"},
    #         {
    #             "role": "user",
    #             "content": "Write a limerick about the Python programming language.",
    #         },
    #     ]
    # )

    # # Print the text response
    # text_response = response.output[0].content[0].text
    # print(text_response)


# import os
# from your_mcp import MCPClient, PlanOutput  # adjust import paths
# from your_llm import LLM

# async def run_agent(initial_user_msg):
#     client = MCPClient()
#     await client.connect()
#     tools = await client.get_tools()
#     llm = LLM(model_name="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))

#     # system/developer instructions
#     system_msg = {
#         "role": "developer",
#         "content": """
# You are a helpful AI assistant that can write essays, poems, and other creative content. You have access to tools for research and writing.
# Plan each part before writing. Use tools as needed. When task is complete, output a final_answer.
# """
#     }
#     # start conversation
#     context = [system_msg, {"role": "user", "content": initial_user_msg}]
#     max_steps = 10

#     for step in range(max_steps):
#         resp = await llm.parse_response(messages=context, tools=tools, response_format=PlanOutput)
#         # Example of expected structure:
#         # {"thought": "...", "action": "search", "action_input": "...", "final_answer": None}

#         thought = getattr(resp, "thought", None)
#         action = getattr(resp, "action", None)
#         final = getattr(resp, "final_answer", None)

#         context.append({"role": "assistant", "content": f"Thought: {thought}"})

#         if action:
#             context.append({"role": "assistant", "content": f"Action: {action}({resp.action_input})"})
#             # call the tool
#             tool_output = await client.call_tool(action, resp.action_input)
#             context.append({"role": "tool", "content": tool_output})
#             context.append({"role": "assistant", "content": f"Observation: {tool_output}"})
#         elif final:
#             # DONE
#             print("Agent finished!")
#             return final

#     raise RuntimeError("Max steps reached without completion")


# # Example usage:
# if __name__ == "__main__":
#     import asyncio
#     final = asyncio.run(run_agent(
#         "Write a thoughtful essay about the cultural impact of Star Wars, ≥500 words, references from original trilogy, prequels, sequels."
#     ))
#     print("Essay output:\n", final)


# async def run_agent_loop(llm, tools, initial_task):
#     context, done = [initial_task], False
#     steps = 0
#     max_steps = 10  # safety guard

#     while not done and steps < max_steps:
#         prompt = build_prompt_from_context(context)
#         response = await llm.parse_response(
#             messages=prompt, tools=tools, response_format=PlanOutput
#         )
#         # assume response includes: thought, action?, tool, final_answer?
#         context.append(response.thought)

#         if response.action:
#             output = await client.call_tool(response.tool, response.action_input)
#             context.append(output)
#             # let the agent reflect
#             context.append(f"Observation: {output}")
#         elif response.final_answer:
#             return response.final_answer

#         steps += 1

#     if steps >= max_steps:
#         raise RuntimeError("Max steps reached without completion.")
