@echo off

start cmd /k "cd server && py app.py"
start cmd /k "cd client && ng serve"