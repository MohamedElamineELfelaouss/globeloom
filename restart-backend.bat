@echo off
echo Restarting backend server...
cd backend
taskkill /F /IM node.exe 2>nul
timeout /t 2
npm run dev
