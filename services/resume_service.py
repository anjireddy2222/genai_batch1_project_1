from prompts import chat_prompt
from services.llm_service import LLMService
class ChatService:
    
    def ai_chat(self, request):
        llm_service = LLMService()
        prompt = chat_prompt.prompt
        print( prompt )
        llm_service.llm_invoke(prompt + ". /n user input: " + request.message , request)
        return "AI reply from service file"
    

