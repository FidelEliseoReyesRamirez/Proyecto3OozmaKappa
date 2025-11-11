<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\PreventManualUrlAccess;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //  Middlewares web base (Inertia, etc.)
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //  Alias personalizados
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'prevent.manual' => PreventManualUrlAccess::class,
        ]);

        // Agregar el middleware de protección manual DESPUÉS del de autenticación
        //    (esto permite que Auth::user() ya esté disponible)
        $middleware->web(append: [
            PreventManualUrlAccess::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->withCommands([
        // Registro del comando para limpiar documentos viejos
        App\Console\Commands\PurgeOldDocuments::class,
    ])
    ->withSchedule(function (Schedule $schedule) {
        // Ejecuta el comando todos los días a la medianoche
        $schedule->command('documents:purge')->daily();
    })
    ->create();
