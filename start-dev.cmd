@echo off
setlocal

title XYVORAN OS Dev Server
cd /d "%~dp0"

if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
)

echo Starting XYVORAN OS dev server...
echo.
npm.cmd run dev

echo.
echo Dev server stopped. Review any output above.
pause
