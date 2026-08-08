<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API Endpoints for frontend interactivity (if any)
Route::prefix('v1')->group(function () {
    //
});
