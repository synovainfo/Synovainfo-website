<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Synova Infotech — Laravel Enterprise Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'name' => 'Synova Infotech API Server',
        'status' => 'online',
        'version' => '1.0.0',
        'environment' => config('app.env'),
        'docs' => '/api/health',
    ]);
});
