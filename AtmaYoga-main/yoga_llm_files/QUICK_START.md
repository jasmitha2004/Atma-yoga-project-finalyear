# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd yoga_llm_files
pip install -r requirements.txt
```

**Note:** This may take a few minutes as it installs PyTorch and transformers.

## Step 2: Start the Service

```bash
python app.py
```

Or use the helper script:

```bash
python start_service.py
```

You should see:
```
==================================================
Starting AtmaYoga LLM Service
==================================================
Service will be available at: http://127.0.0.1:8000
Health check: http://127.0.0.1:8000/health
Chat endpoint: http://127.0.0.1:8000/chat
==================================================

⚠️  Note: First request may take 30-60 seconds to load the model
==================================================
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 3: Verify Service is Running

Open your browser and go to:
- http://127.0.0.1:8000/health

You should see:
```json
{"status": "healthy", "service": "AtmaYoga LLM"}
```

## Step 4: Test the Chatbot

Now go to your frontend and try the chatbot. It should work!

## Common Issues

### Issue: "Service temporarily unavailable"

**Solution:** Make sure the service is running (Step 2)

### Issue: Import errors when starting

**Solution:** Install dependencies (Step 1)

### Issue: Model loading takes too long

**Solution:** This is normal on first request. Wait 30-60 seconds.

### Issue: Port 8000 already in use

**Solution:** 
1. Find what's using port 8000 and stop it
2. Or change the port in `app.py` and update `chatbot.jsx`

## Need Help?

See `TROUBLESHOOTING.md` for detailed troubleshooting steps.

