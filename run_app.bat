@echo off
echo [Adot Chatbot] Starting Backend...
start cmd /k "cd api && python index.py"

echo [Adot Chatbot] Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo [Adot Chatbot] Both servers should be launching in separate windows.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
pause
