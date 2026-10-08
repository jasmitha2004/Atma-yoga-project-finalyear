# ⚡ Quick Start - Run All Services

## The Problem

The chatbot shows "Service temporarily unavailable" because **the LLM service is not running**.

## ✅ Solution: Run 3 Services

You need **3 terminal windows** open at the same time:

---

### 🟢 Terminal 1: LLM Service (Python) - **REQUIRED FOR CHATBOT**

```bash
cd yoga_llm_files
python app.py
```

**Wait for:** `Uvicorn running on http://127.0.0.1:8001`

**✅ This is what's missing!** Without this, the chatbot won't work.

---

### 🔵 Terminal 2: Backend (Node.js)

**Option A - Use server.js:**
```bash
node server.js
```

**Option B - Use server folder:**
```bash
cd server
npm start
```

**Wait for:** `Server running on http://localhost:3000` (or 5000)

---

### 🟡 Terminal 3: Frontend (React)

```bash
cd frontend
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

---

## ✅ Verify Everything Works

1. **Check LLM Service:** Open http://127.0.0.1:8001/health
   - Should show: `{"status": "healthy"}`

2. **Check Backend:** Open http://localhost:3000/ (or 5000)
   - Should show: `AtmaYoga backend running`

3. **Check Frontend:** Open http://localhost:5173/
   - Should show: Your website

4. **Test Chatbot:** Go to chatbot page and send a message
   - Should work now! ✅

---

## 🎯 Visual Guide

```
┌─────────────────────────────────────────┐
│  Terminal 1: LLM Service (Port 8001)   │
│  cd yoga_llm_files                     │
│  python app.py                         │
│  ⚠️ REQUIRED FOR CHATBOT!              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Terminal 2: Backend (Port 3000/5000)  │
│  node server.js                         │
│  OR                                     │
│  cd server && npm start                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Terminal 3: Frontend (Port 5173)      │
│  cd frontend                            │
│  npm run dev                            │
└─────────────────────────────────────────┘
```

---

## 🐛 Still Not Working?

### Error: "Cannot connect to service"

**Fix:** Make sure Terminal 1 (LLM Service) is running!

```bash
# Check if service is running
cd yoga_llm_files
python check_service.py
# Or open: http://127.0.0.1:8001/health
```

### Error: "Module not found"

**Fix:** Install dependencies

```bash
cd yoga_llm_files
pip install -r requirements.txt
```

### Port Already in Use

**Fix:** Stop the service using that port, or change the port in the code.

---

## 📝 Summary

**You MUST run all 3 services:**
1. ✅ LLM Service (Python) - Port 8001
2. ✅ Backend (Node.js) - Port 3000 or 5000  
3. ✅ Frontend (React) - Port 5173

**The chatbot needs the LLM service (Terminal 1) to work!**

---

For detailed instructions, see `START_ALL_SERVICES.md`

