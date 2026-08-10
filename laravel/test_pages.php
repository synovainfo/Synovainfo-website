<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

$routes = [
    '/admin',
    '/admin/pages',
    '/admin/services',
    '/admin/leads',
];

$user = \App\Models\User::first();
if (!$user) {
    echo "No user found.\n";
    exit;
}

foreach ($routes as $uri) {
    echo "Testing $uri...\n";
    $request = Illuminate\Http\Request::create($uri, 'GET');
    
    // Authenticate
    $app['auth']->guard()->setUser($user);
    
    try {
        $response = $kernel->handle($request);
        $content = $response->getContent();
        echo "Status: " . $response->getStatusCode() . "\n";
        echo "Length: " . strlen($content) . " bytes\n";
        if (strlen($content) < 500) {
            echo "Content: $content\n";
        } else {
            echo "Body start: " . substr(trim($content), 0, 100) . "...\n";
            echo "Body end: " . substr(trim($content), -100) . "\n";
        }
    } catch (\Throwable $e) {
        echo "Exception: " . $e->getMessage() . "\n";
        echo $e->getTraceAsString() . "\n";
    }
    echo "---------------------------\n";
}
