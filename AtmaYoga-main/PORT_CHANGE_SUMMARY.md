# ✅ Port Changed from 8000 to 8001

## What Changed

The LLM service port has been changed from **8000** to **8001** to avoid conflicts.

## Updated Files

### Core Service Files
- ✅ `yoga_llm_files/app.py` - Changed port to 8001
- ✅ `frontend/src/components/chatbot.jsx` - Updated to use port 8001
- ✅ `server.js` - Updated proxy to use port 8001

### Test & Utility Files
- ✅ `yoga_llm_files/check_service.py` - Updated health check URL
- ✅ `yoga_llm_files/test_service.py` - Updated base URL
- ✅ `yoga_llm_files/start_service.py` - Updated port

### Documentation
- ✅ `yoga_llm_files/README.md` - All port references updated
- ✅ `QUICK_START.md` - Updated port references
- ✅ `START_ALL_SERVICES.md` - Updated port references

## New Port Configuration

| Service | Port | URL |
|---------|------|-----|
| **LLM Service** | **8001** | http://127.0.0.1:8001 |
| Backend | 3000 or 5000 | http://localhost:3000 or 5000 |
| Frontend | 5173 | http://localhost:5173 |

## How to Start

```bash
cd yoga_llm_files
python app.py
```

**Service will run on:** http://127.0.0.1:8001

## Verify It's Working

1. **Health Check:** http://127.0.0.1:8001/health
2. **Chat Endpoint:** http://127.0.0.1:8001/chat

## Notes

- The chatbot UI automatically uses the new port (8001)
- No manual configuration needed
- Port 8001 should be free on most systems
- If port 8001 is also in use, change it in `yoga_llm_files/app.py` line 120

