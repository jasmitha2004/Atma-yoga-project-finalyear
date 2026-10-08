# Yoga LLM Service - Working Code

This service integrates the fine-tuned Llama-3-8b model from the `yoga_llm_files` folder.

## ✅ Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd yoga_llm_files
pip install -r requirements.txt
```

**Note:** This installs PyTorch, transformers, and other dependencies. May take 5-10 minutes.

### Step 2: Start the Service

**Windows:**
```bash
python app.py
```

Or double-click `run.bat`

**Linux/Mac:**
```bash
python app.py
```

Or:
```bash
chmod +x run.sh
./run.sh
```

You should see:
```
============================================================
🚀 AtmaYoga LLM Service Starting...
============================================================
Service will be available at: http://127.0.0.1:8001
Health check: http://127.0.0.1:8001/health
Chat endpoint: http://127.0.0.1:8001/chat
============================================================
```

### Step 3: Test It

Open your browser and go to:
- http://127.0.0.1:8001/health

You should see: `{"status": "healthy", "service": "AtmaYoga LLM"}`

Now test the chatbot in your frontend - it should work!

## 🎯 Features

✅ **Automatic Fallback**: If the AI model fails to load, the service uses intelligent rule-based responses  
✅ **Model Integration**: Uses the fine-tuned Llama-3-8b adapter from `yoga_llm_files/`  
✅ **Asana Recommendations**: Automatically recommends yoga poses based on user's mood  
✅ **Error Handling**: Robust error handling ensures the service always responds  

## 📁 Files

- `app.py` - FastAPI service (main entry point)
- `yoga_llm_service.py` - Model loading and chatbot logic
- `requirements.txt` - Python dependencies
- `run.bat` / `run.sh` - Quick start scripts

## 🔧 How It Works

1. **Service starts** on port 8001
2. **First request** loads the AI model (takes 30-60 seconds)
3. **Subsequent requests** are fast
4. **If model fails**, falls back to rule-based responses (still works!)

## 🧪 Testing

Test the service manually:

```bash
# Test health
curl http://127.0.0.1:8001/health

# Test chat
curl -X POST http://127.0.0.1:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am feeling stressed"}'
```

Or use the test script:
```bash
python test_service.py
```

## ⚠️ Important Notes

1. **First Request**: The first chat request will take 30-60 seconds while the model loads. This is normal!

2. **Model Files**: Ensure these files are in `yoga_llm_files/`:
   - `adapter_config.json`
   - `adapter_model.safetensors`
   - `tokenizer_config.json`
   - `tokenizer.json`
   - `special_tokens_map.json`

3. **System Requirements**:
   - Python 3.8+
   - ~8GB RAM (for model)
   - Internet connection (first run downloads base model)

4. **Port**: Service runs on port 8001. If it's in use, change it in `app.py` line 120.

## 🐛 Troubleshooting

### Service won't start

**Error: "No module named 'transformers'"**
```bash
pip install -r requirements.txt
```

### Port 8001 already in use

**Option 1:** Stop the other service using port 8001

**Option 2:** Change the port in `app.py`:
```python
uvicorn.run(app, host="127.0.0.1", port=8001)  # Change to 8001
```

Then update `frontend/src/components/chatbot.jsx` line 33 to use port 8001.

### Model loading fails

The service will automatically use fallback mode. You'll still get responses, just not from the AI model.

To fix:
- Check all model files are present
- Ensure you have enough RAM (~8GB)
- Check internet connection (needed for base model download)

### "Service temporarily unavailable" in chatbot

1. Make sure the service is running (`python app.py`)
2. Check http://127.0.0.1:8001/health works
3. Check browser console for errors (F12)

## 📝 API Endpoints

### Health Check
```
GET http://127.0.0.1:8001/health
```

### Chat
```
POST http://127.0.0.1:8001/chat
Content-Type: application/json

{
  "message": "I'm feeling stressed"
}
```

**Response:**
```json
{
  "answer": "I understand you're feeling stressed...",
  "recommended_asana": "Balasana (Child's Pose)..."
}
```

## 🎉 Success!

Once the service is running and you see the health check working, your chatbot should work perfectly!

The service integrates the model from `yoga_llm_files` and provides intelligent, empathetic responses about yoga and wellness.
