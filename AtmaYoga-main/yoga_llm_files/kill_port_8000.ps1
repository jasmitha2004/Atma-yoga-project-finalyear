# PowerShell script to kill process using port 8000
Write-Host "Finding process using port 8000..." -ForegroundColor Yellow

$process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Killing process(es) on port 8000..." -ForegroundColor Red
    foreach ($pid in $process) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Killing: $($proc.ProcessName) (PID: $pid)" -ForegroundColor Cyan
            Stop-Process -Id $pid -Force
        }
    }
    Write-Host ""
    Write-Host "✅ Port 8000 is now free!" -ForegroundColor Green
    Write-Host "You can now run: python app.py" -ForegroundColor Yellow
} else {
    Write-Host "Port 8000 is already free!" -ForegroundColor Green
}

