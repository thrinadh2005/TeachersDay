@echo off
title CSE Teachers' Day Celebration 2026 - GMRIT
color 0B
cls

echo ===============================================================================
echo     🎓 GMR INSTITUTE OF TECHNOLOGY - CSE DEPARTMENT
echo     🎉 TEACHERS' DAY CELEBRATION 2026 PLATFORM
echo ===============================================================================
echo.

cd /d "%~dp0"

echo  [*] Verifying Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [X] Node.js is not found on your system PATH.
    echo      Please install Node.js from https://nodejs.org/ and run this again.
    pause
    exit /b 1
)

IF NOT EXIST "node_modules" (
    echo  [!] Installing dependencies for first-time launch...
    call npm install
    if %errorlevel% neq 0 (
        echo  [X] npm install failed. Please check internet connection.
        pause
        exit /b %errorlevel%
    )
)

echo.
echo  -------------------------------------------------------------------------------
echo    🚀 Web Application URL : http://localhost:5173/
echo    👨‍🏫 Active CSE Faculty  : 33 Official Faculty Members
echo    🎟️ Student Registration : Rs. 50 (Razorpay / UPI / Cards)
echo  -------------------------------------------------------------------------------
echo.

echo  [*] Starting High-Speed Full-Stack Server...
echo  [*] Opening browser automatically...
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173/"

call npm run dev

pause
