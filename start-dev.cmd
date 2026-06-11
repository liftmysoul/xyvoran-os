@echo off
setlocal

title XYVORAN OS Dev Server
cd /d "%~dp0"

echo Starting XYVORAN OS dev server...
echo.
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\next\dist\bin\next" dev -p 3000
) else (
  npm.cmd run dev
)

echo.
echo Dev server stopped. Review any output above.
pause
