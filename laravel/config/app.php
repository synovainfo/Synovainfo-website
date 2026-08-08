<?php

return [

    'name' => env('APP_NAME', 'Synova Infotech'),

    'env' => env('APP_ENV', 'production'),

    'debug' => (bool) env('APP_DEBUG', false),

    'url' => env('APP_URL', 'http://localhost'),

    'timezone' => 'UTC',

    'locale' => 'en',

    'fallback_locale' => 'en',

    'faker_locale' => 'en_US',

    'key' => env('APP_KEY', 'base64:UMXKatwiH2Gl2mEmpWfUkUkROMn5ZpJ4qrylTI7rPNk='),

    'cipher' => 'AES-256-CBC',

    'maintenance' => [
        'driver' => 'file',
    ],

];
