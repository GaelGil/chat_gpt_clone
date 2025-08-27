from pydantic import BaseModel


class APIResponseType(BaseModel):
    message: str
    function_call: str
