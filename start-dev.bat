@echo off
echo ========================================
echo  Starting Next.js Dev Server (Windows)
echo ========================================

echo 1. Setting environment variables...
set TURBOPACK=0
set NEXT_TELEMETRY_DISABLED=1

echo 2. Starting development server...
echo.
echo NOTE: If you still get errors, run the cleanup script first.
echo.

pnpm dev

pause