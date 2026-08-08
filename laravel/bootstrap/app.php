<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
<<<<<<< HEAD
        api: __DIR__.'/../routes/api.php',
=======
>>>>>>> c05ecdb6ad438865977435b644e98e5f97a9d67f
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
<<<<<<< HEAD
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom enterprise exception handling
=======
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
>>>>>>> c05ecdb6ad438865977435b644e98e5f97a9d67f
    })->create();
