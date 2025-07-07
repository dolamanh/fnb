@echo off
set PATH=%PATH%;C:\Users\ADMIN\AppData\Local\Android\Sdk\platform-tools
adb shell input keyevent 82
timeout /t 1 /nobreak >nul
adb shell input keyevent 46
