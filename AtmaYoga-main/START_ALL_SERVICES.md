# 🚀 Complete Guide: Starting All Services

## Why the Error Occurs

The chatbot shows "Service temporarily unavailable" because **the LLM service (Python FastAPI) is not running**. The chatbot tries to connect to `http://localhost:8000/chat`, but nothing is listening on that port.

## ✅ You Need to Run 3 Services

### 1. **Frontend (React)** - Port 5173
### 2. **Backend (Node.js)** - Port 3000 or 5000  
### 3. **LLM Service (Python FastAPI)** - Port 8001 ⚠️ **THIS IS MISSING!**

---

## 📋 Step-by-Step Instructions

### **Terminal 1: Start LLM Service (Python FastAPI)**

This is the service that handles chatbot requests. **This is what's missing!**

```bash
# Navigate to yoga_llm_files folder
cd yoga_llm_files

# Install dependencies (only first time)
pip install -r requirements.txt

# Start the service
python app.py
```

**You should see:**
```
============================================================
🚀 AtmaYoga LLM Service Starting...
============================================================
Service will be available at: http://127.0.0.1:8001
Health check: http://127.0.0.1:8001/health
Chat endpoint: http://127.0.0.1:8001/chat
============================================================
INFO:     Uvicorn running on http://127.0.0.1:8001
```

**✅ Keep this terminal open!** The service must stay running.

---

### **Terminal 2: Start Backend (Node.js)**

You have two options:

#### Option A: Use `server.js` (Port 3000)
```bash
# From project root
node server.js
```

#### Option B: Use `server/index.js` (Port 5000)
```bash
cd server
npm install  # First time only
npm start
```

**You should see:**
```
🚀 Server running on http://localhost:3000
```
or
```
🚀 Server running on port 5000
```

**✅ Keep this terminal open!**

---

### **Terminal 3: Start Frontend (React)**

```bash
cd frontend
npm install  # First time only
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Keep this terminal open!**

---

## ✅ Verification Checklist

After starting all 3 services, verify each one:

### 1. Check LLM Service (Port 8001)
Open browser: http://127.0.0.1:8001/health

Should see: `{"status": "healthy", "service": "AtmaYoga LLM"}`

### 2. Check Backend (Port 3000 or 5000)
Open browser: http://localhost:3000/ (or http://localhost:5000/)

Should see: `AtmaYoga backend running`

### 3. Check Frontend (Port 5173)
Open browser: http://localhost:5173/

Should see: Your AtmaYoga website

---

## 🎯 Quick Start Scripts

### Windows (PowerShell)

Create `start-all.ps1`:
```powershell
# Start LLM Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd yoga_llm_files; python app.py"

# Wait a bit
Start-Sleep -Seconds 2

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

Run: `.\start-all.ps1`

### Linux/Mac (Bash)

Create `start-all.sh`:
```bash
#!/bin/bash

# Start LLM Service
cd yoga_llm_files
python app.py &
LLM_PID=$!

# Start Backend
cd ..
node server.js &
BACKEND_PID=$!

# Start Frontend
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "All services started!"
echo "LLM Service PID: $LLM_PID"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $LLM_PID $BACKEND_PID $FRONTEND_PID" EXIT
wait
```

Run: `chmod +x start-all.sh && ./start-all.sh`

---

## 🔍 Troubleshooting

### Error: "Service temporarily unavailable"

**Cause:** LLM service (port 8001) is not running

**Fix:**
1. Open Terminal 1
2. Go to `yoga_llm_files` folder
3. Run `python app.py`
4. Wait for "Uvicorn running on http://127.0.0.1:8000"
5. Try chatbot again

### Error: "Cannot connect to backend"

**Cause:** Backend (port 3000/5000) is not running

**Fix:**
1. Open Terminal 2
2. Run `node server.js` or `cd server && npm start`
3. Wait for "Server running"
4. Refresh frontend

### Error: "Module not found" in LLM service

**Cause:** Dependencies not installed

**Fix:**
```bash
cd yoga_llm_files
pip install -r requirements.txt
```

### Port Already in Use

**Cause:** Another service is using the port

**Fix:**
- **Port 8001:** Stop other Python services or change port in `yoga_llm_files/app.py` (line 120)
- **Port 3000/5000:** Stop other Node.js services
- **Port 5173:** Stop other Vite/React apps

---

## 📊 Service Summary

| Service | Port | Command | Status Check |
|---------|------|---------|--------------|
| **LLM Service** | 8001 | `cd yoga_llm_files && python app.py` | http://127.0.0.1:8001/health |
| **Backend** | 3000 or 5000 | `node server.js` or `cd server && npm start` | http://localhost:3000/ |
| **Frontend** | 5173 | `cd frontend && npm run dev` | http://localhost:5173/ |

---

## ✅ Final Checklist

Before testing the chatbot:

- [ ] LLM Service running (Terminal 1) - Port 8000
- [ ] Backend running (Terminal 2) - Port 3000 or 5000
- [ ] Frontend running (Terminal 3) - Port 5173
- [ ] All health checks pass
- [ ] Browser console shows no errors (F12)

**Now try the chatbot - it should work!** 🎉

