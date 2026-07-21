from config.llm_client import LLMClient


class LLMService:

    def llm_invoke(self, prompt, request):
        llm_client = LLMClient.get_client(provider="openai")
        print(llm_client)
        response = llm_client.invoke(prompt)
        print( response )







