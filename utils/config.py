CONFIG: dict = { 
    'BASE_URL': 'http://localhost:8080/v1',
    'API_KEY': 'sk-no-key-required',
    'SYSTEM_PROMPT': '',
    'MODEL_NAME': 'LLaMA_CPP',
    'GOAL': 'Write a outline to essay on a given stubject',
    'USER_QUERY': '',
    'OUTPUT_FORMAT': {
        'goal_status': 'bool if goal/task is complete',
        'status': 'if another function needs to run',
        'action': 'you are given the name of the functions in tools, Each item in tools has Tool.name. so the name of the function to call',
        'tools_used': 'list of tools used from given tools',
        'content': 'the accomplished goal'
        }
}