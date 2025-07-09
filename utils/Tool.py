from typing import Callable
class Tool:
    def __init__(self, name: str, func: Callable, param: dict, description: str):
        self.name = name
        self.func = func
        self.param = param
        self.description = description
    def to_dict(self) -> dict:
        return {
            'type': 'function',
            'function' : {
                'name': self.name,
                'param': self.param,
                'description': self.description
            }
        }