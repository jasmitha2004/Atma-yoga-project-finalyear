from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from yoga_llm import yoga_chatbot

app = FastAPI(title="AtmaYoga LLM Service")

# ===============================
# CORS CONFIG
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# Request Schema
# ===============================
class ChatRequest(BaseModel):
    message: str

# ===============================
# Response Schema
# ===============================
class ChatResponse(BaseModel):
    answer: str
    recommended_asana: Optional[str] = None

# ===============================
# Health Check
# ===============================
@app.get("/")
def root():
    return {"status": "AtmaYoga LLM running"}

# ===============================
# Chatbot API
# ===============================
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    yoga_chatbot() returns:
    {
        "answer": "...",
        "recommended_asana": "..." or None
    }
    """
    result = yoga_chatbot(request.message)

    return {
        "answer": result.get("answer", "I'm here to help you."),
        "recommended_asana": result.get("recommended_asana"),
    }
