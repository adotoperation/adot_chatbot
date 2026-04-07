# Adot Chatbot Start Script

Write-Host "Starting Adot Chatbot..." -ForegroundColor Cyan

# Start Backend
Write-Host "Launching Backend (Flask)..." -ForegroundColor Green
$pyCommand = "python index.py"
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    if (Get-Command python3 -ErrorAction SilentlyContinue) {
        $pyCommand = "python3 index.py"
    }
}
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location api; $pyCommand"


# Start Frontend
Write-Host "Launching Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Write-Host "Both servers are starting. Backend: http://localhost:5000, Frontend: http://localhost:5173" -ForegroundColor Yellow
