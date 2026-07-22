from prompts import chat_prompt
from services.llm_service import LLMService
import json
class ChatService:
    
    def ai_chat(self, request):
        llm_service = LLMService()
        prompt = chat_prompt.prompt
        # print( prompt )
        llm_response = llm_service.llm_invoke(prompt + ". /n user input: " + request.message + "/n current state:  " + str(request.profile_data) , request)
        llm_response = json.loads(llm_response)
        return llm_response

    
    

