#!/bin/bash

# Exit on fail
set -e

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Specific permissions for storage
echo "Setting permissions..."
chmod -R 777 storage bootstrap/cache

# Clear all caches to prevent stale config/routes issues
echo "Clearing caches..."
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# NOTE: We disabled production caching for now to debug routing issues.
# Once stable, we can uncomment these:
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# Start Apache in foreground
echo "Starting Apache..."
exec apache2-foreground
