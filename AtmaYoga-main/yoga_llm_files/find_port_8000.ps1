# PowerShell script to find what's using port 8000
Write-Host "Checking what's using port 8000..." -ForegroundColor Yellow
Write-Host ""

$process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Port 8000 is being used by process ID(s): $process" -ForegroundColor Red
    Write-Host ""
    
    foreach ($pid in $process) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Process Name: $($proc.ProcessName)" -ForegroundColor Cyan
            Write-Host "Process ID: $pid" -ForegroundColor Cyan
            Write-Host "Path: $($proc.Path)" -ForegroundColor Cyan
            Write-Host ""
        }
    }
    
    Write-Host "To kill the process(es), run:" -ForegroundColor Yellow
    foreach ($pid in $process) {
        Write-Host "  Stop-Process -Id $pid -Force" -ForegroundColor Green
    }
    Write-Host ""
    Write-Host "Or kill all at once:" -ForegroundColor Yellow
    $pids = $process -join ","
    Write-Host "  Stop-Process -Id $pids -Force" -ForegroundColor Green
} else {
    Write-Host "Port 8000 is FREE! You can start the service." -ForegroundColor Green
}

