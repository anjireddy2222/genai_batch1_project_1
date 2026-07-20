from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controller.resume import chat_router

app = FastAPI(title="AI resume builder", version="3.33", description="Chat with AI and get best ATS friendly Resume")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

@app.get("/")
def index():
    print("Server running...")
    return "Server running..."




