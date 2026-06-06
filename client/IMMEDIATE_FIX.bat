@echo off
echo ============================================
echo IMMEDIATE FIX - Stop and Clean Everything
echo ============================================
echo.

cd /d "%~dp0"

echo [CRITICAL] You must STOP the dev server first!
echo.
echo Please:
echo   1. Go to your terminal running "npm run dev"
echo   2. Press Ctrl+C to stop it
echo   3. Come back here and press any key
echo.
pause

echo.
echo [1/4] Removing dist folder (old builds)...
if exist dist (
    rmdir /s /q dist
    echo      Done: dist removed
) else (
    echo      Skipped: dist not found
)
echo.

echo [2/4] Removing .vite cache...
if exist .vite (
    rmdir /s /q .vite
    echo      Done: .vite removed
) else (
    echo      Skipped: .vite not found
)
echo.

echo [3/4] Removing node_modules\.vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo      Done: node_modules\.vite removed
) else (
    echo      Skipped: node_modules\.vite not found
)
echo.

echo [4/4] Clearing browser cache...
echo      IMPORTANT: You must also:
echo      - Press Ctrl+Shift+Delete in your browser
echo      - Clear cached images and files
echo      - Or use Ctrl+F5 (hard refresh) on the page
echo.

echo ============================================
echo  Cleanup Complete!
echo ============================================
echo.
echo Now restart your dev server:
echo   npm run dev
echo.
echo Then hard refresh your browser:
echo   Ctrl + F5
echo.

pause
