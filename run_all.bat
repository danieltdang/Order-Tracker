@echo off

start cmd /k "cd server && python app.py"
start cmd /k "cd client && npm run ng serve"