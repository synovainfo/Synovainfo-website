#!/bin/bash
# =============================================================================
# Synova Infotech — GoDaddy cPanel Production Deployment Script
# =============================================================================

echo "=================================================="
echo "🚀 Starting Synova Production Deployment..."
echo "=================================================="

# 1. Pull latest repository changes
if [ -d ".git" ]; then
    echo "📥 Pulling latest code from Git..."
    git pull origin main
fi

# 2. Check and copy environment variables if missing
if [ ! -f ".env" ]; then
    echo "⚠️  .env missing, copying .env.example..."
    cp .env.example .env
fi

# 3. Install composer dependencies (optimized for production)
if command -v composer &> /dev/null; then
    echo "📦 Installing Composer dependencies..."
    composer install --optimize-autoloader --no-dev
else
    echo "⚠️  Composer CLI not found in PATH, skipping composer install."
fi

# 4. Generate App Key if not set
php artisan key:generate --force

# 5. Fix permissions for storage and bootstrap/cache
echo "🔒 Setting permissions for storage and bootstrap cache..."
chmod -R 775 storage bootstrap/cache

# 6. Run Database Migrations & Seeds
echo "🗄️  Running Database Migrations..."
php artisan migrate --force

# 7. Refresh caches
echo "⚡ Clearing and re-caching config, routes, and views..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=================================================="
echo "✅ Synova Laravel Production Deployment Complete!"
echo "=================================================="
