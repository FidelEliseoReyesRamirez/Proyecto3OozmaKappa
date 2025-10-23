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
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Middlewares web
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Alias personalizados
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'prevent.manual' => PreventManualUrlAccess::class,
        ]);

        // Forzar protección manual en todas las rutas
        $middleware->web(prepend: [
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
