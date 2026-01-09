#!/bin/bash

# Exit on fail
set -e

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Specific permissions for storage
echo "Setting permissions..."
chmod -R 777 storage bootstrap/cache

# Cache configuration/routes/views for production
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in foreground
echo "Starting Apache..."
exec apache2-foreground
