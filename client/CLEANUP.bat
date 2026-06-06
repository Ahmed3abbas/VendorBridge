@echo off
echo ============================================
echo VendorBridge Client - Complete Cleanup
echo ============================================
echo.

cd /d "%~dp0"

echo [1/6] Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo      Done: node_modules removed
) else (
    echo      Skipped: node_modules not found
)
echo.

echo [2/6] Removing dist folder...
if exist dist (
    rmdir /s /q dist
    echo      Done: dist removed
) else (
    echo      Skipped: dist not found
)
echo.

echo [3/6] Removing .vite cache...
if exist .vite (
    rmdir /s /q .vite
    echo      Done: .vite cache removed
) else (
    echo      Skipped: .vite not found
)
echo.

echo [4/6] Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo      Done: package-lock.json removed
) else (
    echo      Skipped: package-lock.json not found
)
echo.

echo [5/6] Cleaning npm cache...
call npm cache clean --force
echo      Done: npm cache cleaned
echo.

echo [6/6] Installing dependencies...
call npm install
echo.

if %errorlevel% equ 0 (
    echo ============================================
    echo  SUCCESS! Cleanup completed successfully
    echo ============================================
    echo.
    echo Next steps:
    echo   1. Run: npm run dev
    echo   2. Check browser console for errors
    echo   3. Verify HMR is working
    echo.
) else (
    echo ============================================
    echo  ERROR! npm install failed
    echo ============================================
    echo.
    echo Please check the error messages above.
)

pause
