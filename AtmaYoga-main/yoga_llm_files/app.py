from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from contextlib import asynccontextmanager
import traceback

# Import the yoga chatbot function
try:
    from yoga_llm_service import yoga_chatbot
    print("✅ Successfully imported yoga_llm_service")
except ImportError as e:
    print(f"❌ Error importing yoga_llm_service: {e}")
    print("Make sure you're running from the yoga_llm_files directory")
    raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("=" * 60)
    print("🚀 AtmaYoga LLM Service Starting...")
    print("=" * 60)
    print("Service will be available at: http://127.0.0.1:8001")
    print("Health check: http://127.0.0.1:8001/health")
    print("Chat endpoint: http://127.0.0.1:8001/chat")
    print("=" * 60)
    print("⚠️  Note: AI model will load on first request (may take 30-60 seconds)")
    print("⚠️  Fallback mode available if model fails to load")
    print("=" * 60)
    yield
    # Shutdown
    print("Service shutting down...")

app = FastAPI(title="AtmaYoga LLM Service", lifespan=lifespan)

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
    return {
        "status": "AtmaYoga LLM running",
        "model": "yoga_llm_files",
        "service": "ready"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "AtmaYoga LLM",
        "endpoint": "/chat"
    }

# ===============================
# Chatbot API
# ===============================
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Chat endpoint that uses the fine-tuned model from yoga_llm_files
    Falls back to rule-based responses if model is not available
    """
    try:
        if not request.message or not request.message.strip():
            return {
                "answer": "Please send me a message! I'm here to help with yoga and wellness.",
                "recommended_asana": None
            }
        
        print(f"📨 Received message: {request.message[:50]}...")
        result = yoga_chatbot(request.message.strip())
        
        print(f"✅ Generated response: {result.get('answer', '')[:50]}...")
        
        return {
            "answer": result.get("answer", "I'm here to help you."),
            "recommended_asana": result.get("recommended_asana"),
        }
        
    except Exception as e:
        print(f"❌ Error in chat endpoint: {e}")
        traceback.print_exc()
        # Return a helpful fallback response
        return {
            "answer": "I'm experiencing some technical difficulties. Please try again in a moment, or feel free to ask me about yoga poses and wellness!",
            "recommended_asana": None
        }

# Startup messages are now handled in lifespan context manager above

if __name__ == "__main__":
    import uvicorn
    import socket
    
    port = 8001
    
    # Check if port is available by trying to bind to it
    def is_port_available(port):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(('127.0.0.1', port))
            sock.close()
            return True
        except OSError:
            sock.close()
            return False
    
    if not is_port_available(port):
        print("=" * 60)
        print(f"❌ ERROR: Port {port} is already in use!")
        print("=" * 60)
        print("\nTo fix this, run:")
        print("  Get-NetTCPConnection -LocalPort 8001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }")
        print("\nOr manually:")
        print("  Get-NetTCPConnection -LocalPort 8001 | Select-Object OwningProcess")
        print("  Stop-Process -Id <PID> -Force")
        print("=" * 60)
        import sys
        sys.exit(1)
    
    try:
        uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
    except OSError as e:
        if "10048" in str(e) or "address already in use" in str(e).lower() or "WinError 10048" in str(e):
            print("=" * 60)
            print(f"❌ ERROR: Port {port} is already in use!")
            print("=" * 60)
            print("\nQuick fix - Run this command:")
            print("  Get-NetTCPConnection -LocalPort 8001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }")
            print("\nThen try again: python app.py")
            print("=" * 60)
            import sys
            sys.exit(1)
        else:
            raise
