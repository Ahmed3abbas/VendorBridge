@echo off
echo ============================================
echo VendorBridge Client - Verification Script
echo ============================================
echo.

cd /d "%~dp0"

echo [1/5] Checking React versions...
call npm list react react-dom 2>nul | findstr "react"
echo.

echo [2/5] Checking React Router version...
call npm list react-router-dom 2>nul | findstr "react-router-dom"
echo.

echo [3/5] Checking Zustand version...
call npm list zustand 2>nul | findstr "zustand"
echo.

echo [4/5] Checking React Hook Form version...
call npm list react-hook-form 2>nul | findstr "react-hook-form"
echo.

echo [5/5] Running ESLint check...
call npm run lint
echo.

echo ============================================
echo Verification Complete
echo ============================================
echo.
echo If you see any UNMET PEER DEPENDENCY warnings,
echo run CLEANUP.bat to fix them.
echo.

pause
