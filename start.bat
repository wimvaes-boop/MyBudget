@echo off
title MyBudget - Financiele Adviseur
echo ====================================================
echo   MyBudget - Gestart op NUC Thuis Server
echo   Toegankelijk via je LAN / Tailscale op poort 3001
echo ====================================================
cd /d "%~dp0"
npm run start
pause
