@echo off
echo Starting Laravel and React servers...

start cmd /k "cd prebuilds_backend && php artisan serve"

start cmd /k "cd prebuilds_frontend && npm run dev"

echo Servers started successfully!