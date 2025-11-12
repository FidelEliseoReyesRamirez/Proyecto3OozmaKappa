<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\PreventManualUrlAccess;
use App\Http\Middleware\CorsMiddleware;   // ← IMPORTANTE

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        /*
        |--------------------------------------------------------------------------
        | 1. MIDDLEWARE GLOBAL (CORS)
        |--------------------------------------------------------------------------
        |
        | Esto habilita CORS para Unity WebGL y React. Se ejecuta ANTES que
        | cualquier otro middleware.
        |
        */
        $middleware->append(CorsMiddleware::class);


        /*
        |--------------------------------------------------------------------------
        | 2. MIDDLEWARES WEB (Inertia y otros)
        |--------------------------------------------------------------------------
        */
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 3. ALIAS PERSONALIZADOS
        |--------------------------------------------------------------------------
        */
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'prevent.manual' => PreventManualUrlAccess::class,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 4. PROTECCIÓN MANUAL (DESPUÉS DE AUTH)
        |--------------------------------------------------------------------------
        */
        $middleware->web(append: [
            PreventManualUrlAccess::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })

    ->withCommands([
        App\Console\Commands\PurgeOldDocuments::class,
    ])

    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('documents:purge')->daily();
    })

    ->create();
