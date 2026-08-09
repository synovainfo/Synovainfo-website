#!/bin/bash
# GoDaddy Shared Hosting Deployment Script
# Run this script from your home directory (~) on GoDaddy.

echo "=================================================="
echo "🚀 Starting Synova Production Deployment..."
echo "=================================================="

# 1. Create target directories
echo "📁 Setting up directories..."
mkdir -p ~/synovainfo-website
mkdir -p ~/public_html

# 2. Extract archive
echo "📦 Extracting application files..."
tar -xzf deploy.tar.gz -C ~/synovainfo-website

# 3. Securely set up public_html
echo "🌐 Configuring public document root..."
# We sync the public assets to public_html
rsync -a ~/synovainfo-website/public/ ~/public_html/

# Update index.php paths for GoDaddy architecture
echo "🛠️ Patching index.php for shared hosting..."
cat > ~/public_html/index.php << 'EOF'
<?php
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../synovainfo-website/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../synovainfo-website/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
$app = require_once __DIR__.'/../synovainfo-website/bootstrap/app.php';

$app->handleRequest(Request::capture());
EOF

# Force HTTPS via .htaccess
cat > ~/public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF

# 4. Environment & Permissions
echo "🔐 Setting permissions..."
cd ~/synovainfo-website
chmod -R 775 storage bootstrap/cache

if [ ! -f ".env" ]; then
    echo "⚠️ .env missing, copying .env.example..."
    cp .env.example .env
    echo "🚨 IMPORTANT: You must edit ~/synovainfo-website/.env to add your production DB credentials!"
fi

# 5. Composer Install
echo "📦 Running Composer Install..."
if command -v /opt/cpanel/composer/bin/composer &> /dev/null; then
    /opt/cpanel/composer/bin/composer install --optimize-autoloader --no-dev
elif command -v composer &> /dev/null; then
    composer install --optimize-autoloader --no-dev
else
    echo "❌ Composer not found in standard paths. You may need to specify its path."
fi

# 6. Generate App Key
echo "🔑 Generating Application Key..."
php artisan key:generate --force

# 7. Create storage symlink
echo "🔗 Creating storage symlink..."
# Shared hosting custom symlink because public is in ~/public_html
ln -sfn ~/synovainfo-website/storage/app/public ~/public_html/storage

# 8. Optimize caches
echo "⚡ Optimizing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=================================================="
echo "✅ Synova Laravel Production Deployment Complete!"
echo "🚨 Next Steps:"
echo "1. Edit ~/synovainfo-website/.env and add your GoDaddy Database Credentials."
echo "2. Run 'php artisan migrate --force' inside ~/synovainfo-website to set up the DB."
echo "=================================================="
