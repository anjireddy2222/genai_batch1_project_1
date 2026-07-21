from config.settings import settings
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

class LLMClient:

    @staticmethod
    def get_client(provider: str | None = None):

        provider = provider or settings.DEFAULT_PROVIDER
        # print( provider )
        if provider.lower() == "openai":
            return ChatOpenAI(model=settings.OPEN_AI_MODEL, api_key=settings.OPEN_AI_API_KEY)
        if provider.lower() == "anthropic":
            return ChatAnthropic(model_name=settings.ANTHROPIC_MODEL, api_key=settings.ANTHROPIC_API_KEY)
        




