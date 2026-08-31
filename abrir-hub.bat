@echo off
title Nextfy Hub
cd /d "%~dp0nextfly-torre"

echo.
echo   NEXTFY HUB
echo   ----------
echo.

where pnpm >nul 2>nul
if errorlevel 1 (
  echo   Pnpm nao encontrado. Abra o Hub pelo Codex ou instale o Node.js com pnpm.
  pause
  exit /b 1
)

if not exist node_modules (
  echo   Dependencias ausentes. Execute: pnpm install
  pause
  exit /b 1
)

echo   Abrindo em http://127.0.0.1:3100
echo   Feche esta janela para desligar o Hub.
echo.
start "" http://127.0.0.1:3100
pnpm dev -- --hostname 127.0.0.1 --port 3100
