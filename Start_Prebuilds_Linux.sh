echo "Starting Laravel and React servers..."

gnome-terminal -- bash -c "cd prebuilds_backend && php artisan serve; exec bash" &

gnome-terminal -- bash -c "cd prebuilds_frontend && npm run dev; exec bash" &

echo "Servers started successfully!"
