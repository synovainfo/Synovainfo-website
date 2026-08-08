<?php

<<<<<<< HEAD
=======
use Illuminate\Foundation\Application;
>>>>>>> c05ecdb6ad438865977435b644e98e5f97a9d67f
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

<<<<<<< HEAD
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
=======
// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

>>>>>>> c05ecdb6ad438865977435b644e98e5f97a9d67f
$app->handleRequest(Request::capture());
