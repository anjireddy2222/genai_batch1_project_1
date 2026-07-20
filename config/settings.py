from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPEN_AI_API_KEY: str
    ANTHROPIC_API_KEY: str
    DEFAULT_PROVIDER: str
    OPEN_AI_MODEL:str
    ANTHROPIC_MODEL: str

    class Config:
        env_file = ".env"


settings = Settings()



