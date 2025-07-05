class Tool:
    def __init__(self, name: str, func: function, param: dict, description: str):
        self.name = name
        self.func = func
        self.param = param
        self.description = description
