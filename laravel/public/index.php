<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ── Auto-Detect Laravel Core Paths for GoDaddy cPanel Git Repositories ────────

$possibleAutoloadPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../laravel_app/vendor/autoload.php',
    __DIR__ . '/../repositories/synova/laravel/vendor/autoload.php',
    dirname(__DIR__) . '/vendor/autoload.php',
];

$possibleBootstrapPaths = [
    __DIR__ . '/../bootstrap/app.php',
    __DIR__ . '/../laravel_app/bootstrap/app.php',
    __DIR__ . '/../repositories/synova/laravel/bootstrap/app.php',
    dirname(__DIR__) . '/bootstrap/app.php',
];

$autoloadFile = null;
foreach ($possibleAutoloadPaths as $path) {
    if (file_exists($path)) {
        $autoloadFile = $path;
        break;
    }
}

$bootstrapFile = null;
foreach ($possibleBootstrapPaths as $path) {
    if (file_exists($path)) {
        $bootstrapFile = $path;
        break;
    }
}

if (!$autoloadFile || !$bootstrapFile) {
    http_response_code(500);
    echo "<h1>500 Internal Server Error</h1><p>Laravel autoloader or bootstrap file not found. Please run <code>composer install</code> in your Laravel project folder.</p>";
    exit(1);
}

// Maintenance Mode check
$maintenanceFile = dirname($bootstrapFile) . '/../storage/framework/maintenance.php';
if (file_exists($maintenanceFile)) {
    require $maintenanceFile;
}

// Register Autoloader
require $autoloadFile;

// Bootstrap Laravel & Handle Request
$app = require_once $bootstrapFile;
$app->handleRequest(Request::capture());
