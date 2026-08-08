# GoDaddy Deluxe Plan Hosting Guide
## Enterprise Deployment Guide for Laravel Application (Synova)

---

### Executive Overview

This document provides a production-grade, step-by-step technical guide for deploying a **Laravel 12 (PHP 8.2+ / MySQL)** application to a **GoDaddy Deluxe Linux Hosting Plan (cPanel)**.

---

## 1. Prerequisites & GoDaddy cPanel Setup

### 1.1 Verify PHP Version (PHP 8.2+ Required)
Laravel 12 requires **PHP 8.2 or 8.3**.
1. Log in to **GoDaddy cPanel**.
2. Under **Software**, click **Select PHP Version** (or **MultiPHP Manager**).
3. Set your domain's PHP version to **8.2** or **8.3**.
4. Enable the following mandatory PHP extensions:
   - `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pcre`, `pdo`, `pdo_mysql`, `session`, `tokenizer`, `xml`, `zip`.

---

## 2. GoDaddy Database Setup (MySQL / MariaDB)

1. In cPanel, under **Databases**, open **MySQL® Database Wizard**.
2. **Step 1: Create Database**:
   - Database name: `synova_db` (Full name: `cpaneluser_synova_db`).
3. **Step 2: Create User**:
   - Username: `synova_user` (Full username: `cpaneluser_synova_user`).
   - Generate a strong password and save it safely.
4. **Step 3: Assign Privileges**:
   - Select **ALL PRIVILEGES** and click **Make Changes**.

---

## 3. Prepare Environment Variables (`.env`)

Prepare the `.env` production values to be placed on your server:

```env
APP_NAME="Synova Infotech"
APP_ENV=production
APP_KEY= # Will be generated using php artisan key:generate
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=daily
LOG_LEVEL=error

# Database Settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cpaneluser_synova_db
DB_USERNAME=cpaneluser_synova_user
DB_PASSWORD="YourSecurePasswordHere"

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false

QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com # or your GoDaddy/SMTP server
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD="YourEmailPassword"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## 4. Deploying Code via Git & SSH

### 4.1 Connect via SSH
Enable SSH in cPanel (**Security** → **SSH Access**) and connect:

```bash
ssh cpaneluser@yourdomain.com -p 22
```

### 4.2 Clone Laravel Outside `public_html`
> **CRITICAL SECURITY REQUIREMENT**: Never upload your entire Laravel folder inside `public_html`. Core files (`.env`, `storage`, `config`) must remain above `public_html` to prevent public access to secrets.

Clone the repository to `/home/cpaneluser/laravel_app`:

```bash
cd ~
git clone https://github.com/your-username/synova.git laravel_app
cd laravel_app/laravel
```

---

## 5. Pointing `public_html` to Laravel Public Directory

### Method A: Symlink (Recommended)
If your domain points to `public_html`, remove the existing `public_html` (back it up first if needed) and create a symbolic link pointing to Laravel's `public` directory:

```bash
cd ~
rm -rf public_html
ln -s /home/cpaneluser/laravel_app/laravel/public public_html
```

### Method B: Index.php Redirection (Alternative)
If symbolic links are restricted by GoDaddy policies:
1. Copy everything inside `laravel/public/` to `public_html/`.
2. Edit `public_html/index.php` and update the paths:
   ```php
   // Change line 1:
   require __DIR__.'/../laravel_app/laravel/vendor/autoload.php';

   // Change line 2:
   $app = require_once __DIR__.'/../laravel_app/laravel/bootstrap/app.php';
   ```

---

## 6. Installation, Migrations & Asset Build

Run the following commands inside `/home/cpaneluser/laravel_app/laravel`:

```bash
# 1. Copy environment file & set permissions
cp .env.example .env
nano .env # Paste your production .env credentials

# 2. Install Composer dependencies
composer install --optimize-autoloader --no-dev

# 3. Generate Laravel Application Key
php artisan key:generate

# 4. Link Storage Directory
php artisan storage:link

# 5. Set Folder Permissions
chmod -R 775 storage bootstrap/cache

# 6. Run Database Migrations & Seeders
php artisan migrate --force
php artisan db:seed --force

# 7. Compile Frontend Assets (Vite)
npm ci
npm run build

# 8. Cache Configuration & Routes for Production Speed
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

---

## 7. Verify `.htaccess` for Clean Routing

Ensure `laravel/public/.htaccess` (or `public_html/.htaccess`) contains standard Laravel rewrite rules:

```htaccess
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 8. Automated Maintenance & CI/CD Deploy Script

Create a bash script `laravel/deploy.sh` for instant updates whenever you push code changes to Git:

```bash
#!/bin/bash
echo "=== Starting Laravel Production Deployment ==="
git pull origin main

composer install --optimize-autoloader --no-dev
php artisan migrate --force

npm ci
npm run build

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Deployment Finished Successfully ==="
```

Make it executable:
```bash
chmod +x deploy.sh
```

Execute whenever you push code:
```bash
./deploy.sh
```

---

---

## 9. Browser-Only Deployment Guide (cPanel Graphical UI)

If you prefer to deploy **100% using your Web Browser** (without needing SSH command line tools on your computer), follow this visual cPanel guide:

### Step 1: Build Assets Locally on Your Computer
Before uploading, build your production CSS/JS assets locally:
1. Open terminal in your local project folder.
2. Run:
   ```bash
   cd laravel
   npm run build
   ```
3. Compress the `laravel` directory (or your whole application) into a `.zip` file on your computer named `laravel_app.zip`.

---

### Step 2: Set PHP Version in cPanel Browser
1. Log in to **GoDaddy cPanel** in your browser.
2. Search for **Select PHP Version** or **MultiPHP Manager**.
3. Select your domain name and change PHP version to **8.2** or **8.3**.
4. Click **Apply** / **Save**.

---

### Step 3: Create MySQL Database via cPanel UI
1. In cPanel, click **MySQL® Database Wizard**.
2. **Step 1**: Enter database name (e.g. `synova_db` -> creates `cpaneluser_synova_db`).
3. **Step 2**: Create a database user (e.g. `synova_user` -> creates `cpaneluser_synova_user`) and password.
4. **Step 3**: Check **ALL PRIVILEGES** and click **Make Changes**.

---

### Step 4: Upload and Extract Zip File via File Manager
1. In cPanel, under **Files**, click **File Manager**.
2. Click **Settings** (top right corner), check **Show Hidden Files (dotfiles)**, and click **Save**.
3. Stay in the root home folder (`/home/cpaneluser/`) - **do NOT go inside `public_html`**.
4. Click **Upload** in the top menu bar.
5. Drag and drop your `laravel_app.zip` file.
6. Once upload reaches 100% (green), close the tab and return to File Manager.
7. Right-click `laravel_app.zip` and select **Extract** -> target directory `/home/cpaneluser/laravel_app`.

---

### Step 5: Configure `.env` File in cPanel Browser Editor
1. In File Manager, double click `laravel_app`.
2. Find `.env.example`, right-click it, select **Copy**, and type `.env` as the new file name.
3. Right-click `.env` and select **Edit**.
4. Update your production settings:
   ```env
   APP_NAME="Synova Infotech"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=cpaneluser_synova_db
   DB_USERNAME=cpaneluser_synova_user
   DB_PASSWORD=YourPasswordHere
   ```
5. Click **Save Changes** in top right corner.

---

### Step 6: Move Public Files to `public_html` & Edit `index.php`
1. Open `laravel_app/public` in File Manager.
2. Click **Select All** in top bar.
3. Click **Copy** (or **Move**).
4. Set destination path to `/public_html/`.
5. Navigate to `public_html/`.
6. Right-click `index.php` and click **Edit**.
7. Change line ~47:
   ```php
   require __DIR__.'/../laravel_app/vendor/autoload.php';
   ```
8. Change line ~61:
   ```php
   $app = require_once __DIR__.'/../laravel_app/bootstrap/app.php';
   ```
9. Click **Save Changes**.

---

### Step 7: Fix Storage Permissions in File Manager
1. In File Manager, navigate to `laravel_app`.
2. Right-click the `storage` folder, select **Change Permissions**, check all Write boxes (**775** or **777**), and click **Change Permissions**.
3. Repeat for `bootstrap/cache` folder.

---

### Step 8: Run Artisan Commands & Database Import via cPanel Browser

#### Option A: Using cPanel Web Terminal Tool (Easiest)
1. In cPanel, scroll down to **Advanced** and click **Terminal**.
2. Run this single command:
   ```bash
   cd ~/laravel_app && php artisan key:generate && php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```

#### Option B: Using phpMyAdmin for Database Import
1. In cPanel, click **phpMyAdmin**.
2. Click your database (`cpaneluser_synova_db`) on the left panel.
3. Click **Import** tab at the top.
4. Click **Choose File** and upload your database export `.sql` file from your computer.
5. Click **Import** at the bottom.

---

### Verification Checklist
- [x] PHP version set to 8.2 / 8.3 in cPanel.
- [x] Database created and permissions granted.
- [x] Code uploaded to `/home/cpaneluser/laravel_app` via File Manager.
- [x] `.env` created and edited in browser.
- [x] Public files copied to `public_html` and `index.php` paths updated.
- [x] Site opens cleanly at `https://yourdomain.com`!
