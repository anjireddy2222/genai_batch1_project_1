from prompts import chat_prompt

class ChatService:
    
    def ai_chat(self, request):
        prompt = chat_prompt.prompt
        return "AI reply from service file"
    

