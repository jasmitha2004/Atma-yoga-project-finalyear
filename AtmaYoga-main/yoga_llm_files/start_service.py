"""
Simple script to start the LLM service with better error handling
"""
import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from app import app
    import uvicorn
    
    print("=" * 50)
    print("Starting AtmaYoga LLM Service")
    print("=" * 50)
    print("Service will be available at: http://127.0.0.1:8001")
    print("Health check: http://127.0.0.1:8001/health")
    print("Chat endpoint: http://127.0.0.1:8001/chat")
    print("=" * 50)
    print("\n⚠️  Note: First request may take 30-60 seconds to load the model")
    print("=" * 50)
    
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")
    
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("\nPlease install dependencies:")
    print("  pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error starting service: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

