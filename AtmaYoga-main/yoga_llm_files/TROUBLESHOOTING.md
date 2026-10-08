# Troubleshooting Guide

## Service Not Available Error

If you're seeing "❌ Sorry, the service is temporarily unavailable", follow these steps:

### 1. Check if Service is Running

```bash
# Check if port 8000 is in use
# Windows:
netstat -ano | findstr :8000

# Linux/Mac:
lsof -i :8000
```

### 2. Start the Service

```bash
cd yoga_llm_files
python start_service.py
```

Or:

```bash
python app.py
```

### 3. Verify Service is Running

Open your browser and go to:
- http://127.0.0.1:8000/health

You should see:
```json
{"status": "healthy", "service": "AtmaYoga LLM"}
```

### 4. Check for Errors

Look at the console output when starting the service. Common issues:

#### Import Errors
```
❌ Import Error: No module named 'transformers'
```
**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

#### Model Loading Errors
```
❌ Error loading model: ...
```
**Possible causes:**
- Missing model files in `yoga_llm_files/`
- Insufficient RAM/VRAM
- Network issues (if downloading base model)

**Solutions:**
- Ensure all files are present:
  - `adapter_config.json`
  - `adapter_model.safetensors`
  - `tokenizer_config.json`
  - `tokenizer.json`
  - `special_tokens_map.json`

- Check available memory (model needs ~8GB)
- First run will download base model (~4GB) - ensure internet connection

#### Port Already in Use
```
❌ Error: Address already in use
```
**Solution:** 
- Stop the service using port 8000
- Or change the port in `app.py`:
  ```python
  uvicorn.run(app, host="127.0.0.1", port=8001)  # Change to 8001
  ```
- Update `frontend/src/components/chatbot.jsx` to use new port

### 5. Test the Service Manually

```bash
# Test health endpoint
curl http://127.0.0.1:8000/health

# Test chat endpoint
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am feeling stressed"}'
```

### 6. Check Browser Console

Open browser developer tools (F12) and check the Console tab for errors when sending a message.

Common errors:
- `Failed to fetch` - Service not running
- `CORS error` - CORS configuration issue (should be fixed in app.py)
- `Network error` - Service crashed or not accessible

### 7. Fallback: Use Simple Version

If the model keeps failing, you can temporarily use a simpler version without the heavy model:

Create `yoga_llm_files/yoga_llm_service_simple.py`:

```python
def yoga_chatbot(user_message: str):
    """Simple fallback without model"""
    # Simple keyword-based responses
    text = user_message.lower()
    
    if any(word in text for word in ["stress", "stressed", "anxious"]):
        return {
            "answer": "I understand you're feeling stressed. Deep breathing and gentle yoga can help. Try Balasana (Child's Pose) for relaxation.",
            "recommended_asana": "Balasana (Child's Pose) - Kneel and sit back on your heels, then fold forward to rest your forehead on the ground."
        }
    
    return {
        "answer": "I'm here to help you with yoga and wellness. How can I assist you today?",
        "recommended_asana": None
    }
```

Then update `app.py` to import from `yoga_llm_service_simple` instead.

## Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] All model files present in `yoga_llm_files/`
- [ ] Service started: `python start_service.py`
- [ ] Health check works: http://127.0.0.1:8000/health
- [ ] Frontend can reach service (check browser console)

## Still Having Issues?

1. Check the service logs for detailed error messages
2. Verify all files are in the correct location
3. Try restarting the service
4. Check system resources (RAM/disk space)
5. Ensure no firewall is blocking port 8000

