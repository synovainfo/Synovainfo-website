<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ── Auto-Detect Laravel Core Paths for GoDaddy cPanel ────────
$possibleAutoloadPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../laravel_app/vendor/autoload.php',
];

$possibleBootstrapPaths = [
    __DIR__ . '/../bootstrap/app.php',
    __DIR__ . '/../laravel_app/bootstrap/app.php',
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
    echo "<h1>500 Internal Server Error</h1><p>Laravel autoloader not found. Please run composer install.</p>";
    exit(1);
}

// Determine if the application is in maintenance mode...
$maintenance = dirname($bootstrapFile) . '/../storage/framework/maintenance.php';
if (file_exists($maintenance)) {
    require $maintenance;
}

// Register the Composer autoloader...
require $autoloadFile;

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $bootstrapFile;

$app->handleRequest(Request::capture());
