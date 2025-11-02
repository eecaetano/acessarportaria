@echo off
echo ================================
echo  INICIANDO SERVIDOR NODE.JS
echo ================================
echo.

:: Vai até a pasta onde o script .bat está localizado
cd /d "%~dp0"

:: Inicia o servidor Node.js
node server.js

:: Mantém a janela aberta para ver mensagens do servidor
pause
