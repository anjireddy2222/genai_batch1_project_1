from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversationId: int
    message: str
