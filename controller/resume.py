from fastapi import APIRouter
from services.resume_service import ChatService
from models.request import ChatRequest
from config.settings import settings
chat_router = APIRouter( prefix="/chat")

chat_Service = ChatService()

@chat_router.post("")
def chat(request: ChatRequest):

    response = chat_Service.ai_chat(request)
    return { "conversationId": 1, "reply": response, "suggestions": "", "turnId": 3, "resume": "", "completeness": "", "test_key": settings.DEFAULT_PROVIDER }




