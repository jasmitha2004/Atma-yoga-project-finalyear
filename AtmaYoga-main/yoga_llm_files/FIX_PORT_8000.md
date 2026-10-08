# 🔧 Fix: Port 8000 Already in Use

## The Problem

You're seeing this error:
```
ERROR: [Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000): 
only one usage of each socket address (protocol/network address/port) is normally permitted
```

This means **something is already running on port 8000**.

## ✅ Quick Fix

### Option 1: Use the Script (Easiest)

```powershell
.\kill_port_8000.ps1
```

Then run:
```powershell
python app.py
```

### Option 2: Manual Fix

**Step 1: Find what's using port 8000**
```powershell
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
```

**Step 2: Kill the process**
```powershell
Stop-Process -Id <PID> -Force
```

Replace `<PID>` with the process ID from Step 1.

### Option 3: Find and Kill in One Command

```powershell
Get-NetTCPConnection -LocalPort 8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## 🔍 Check What's Using the Port

Run this to see details:
```powershell
.\find_port_8000.ps1
```

## ✅ Verify Port is Free

After killing the process, verify:
```powershell
Get-NetTCPConnection -LocalPort 8000
```

Should return nothing (port is free).

## 🚀 Then Start Service

```powershell
python app.py
```

Should now work! ✅

