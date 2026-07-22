from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversationId: int
    message: str
    profile_data: dict
