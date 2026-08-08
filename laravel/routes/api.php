<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Synova Infotech — Laravel Enterprise API Routes
|--------------------------------------------------------------------------
*/

// --- Health Check ---
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        return response()->json([
            'status' => 'healthy',
            'database' => 'connected',
            'timestamp' => now()->toIso8601String(),
            'app' => config('app.name'),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'database' => 'disconnected',
            'error' => $e->getMessage(),
        ], 500);
    }
});

// --- Services ---
Route::get('/services', function () {
    $services = DB::table('services')->whereNull('deletedAt')->where('status', 1)->get();
    return response()->json(['success' => true, 'data' => $services]);
});

Route::get('/services/{slug}', function ($slug) {
    $service = DB::table('services')->where('slug', $slug)->whereNull('deletedAt')->first();
    if (!$service) {
        return response()->json(['success' => false, 'message' => 'Service not found'], 404);
    }
    return response()->json(['success' => true, 'data' => $service]);
});

// --- Industries ---
Route::get('/industries', function () {
    $industries = DB::table('industries')->whereNull('deletedAt')->where('status', 1)->get();
    return response()->json(['success' => true, 'data' => $industries]);
});

// --- Technologies ---
Route::get('/technologies', function () {
    $technologies = DB::table('technologies')->where('status', 1)->get();
    return response()->json(['success' => true, 'data' => $technologies]);
});

// --- Statistics ---
Route::get('/statistics', function () {
    $stats = DB::table('statistics')->whereNull('deletedAt')->where('isVisible', 1)->orderBy('order', 'asc')->get();
    return response()->json(['success' => true, 'data' => $stats]);
});

// --- Testimonials ---
Route::get('/testimonials', function () {
    $testimonials = DB::table('testimonials')->whereNull('deletedAt')->where('status', 1)->orderBy('order', 'asc')->get();
    return response()->json(['success' => true, 'data' => $testimonials]);
});

// --- Core Values ---
Route::get('/core-values', function () {
    $values = DB::table('core_values')->whereNull('deletedAt')->where('status', 1)->orderBy('order', 'asc')->get();
    return response()->json(['success' => true, 'data' => $values]);
});

// --- Careers ---
Route::get('/careers', function () {
    $careers = DB::table('careers')->whereNull('deletedAt')->where('status', 1)->get();
    return response()->json(['success' => true, 'data' => $careers]);
});

// --- Contact Form Submission ---
Route::post('/contacts', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:50',
        'company' => 'nullable|string|max:255',
        'service' => 'nullable|string|max:255',
        'message' => 'required|string',
    ]);

    $id = 'cnt_' . bin2hex(random_bytes(8));
    DB::table('contacts')->insert([
        'id' => $id,
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null,
        'company' => $validated['company'] ?? null,
        'service' => $validated['service'] ?? null,
        'message' => $validated['message'],
        'status' => 'NEW',
        'createdAt' => now(),
        'updatedAt' => now(),
    ]);

    return response()->json(['success' => true, 'message' => 'Thank you! Your inquiry has been received.', 'id' => $id], 201);
});
