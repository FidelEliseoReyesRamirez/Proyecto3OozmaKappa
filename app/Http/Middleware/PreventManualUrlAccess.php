<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PreventManualUrlAccess
{
    public function handle(Request $request, Closure $next)
    {
        $path = $request->getPathInfo();
        $user = $request->user();

        Log::info('PreventManualUrlAccess: Solicitud detectada', [
            'path' => $path,
            'method' => $request->method(),
            'has_inertia' => $request->headers->has('X-Inertia'),
            'user_id' => optional($user)->id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | EXCEPCIONES DEL UNITY VIEWER Y ARCHIVOS ESTÁTICOS
        |--------------------------------------------------------------------------
        */
        $allowPrefixes = [
            '/planos/',
            '/Build/',
            '/StreamingAssets/',
            '/storage/planos/',
            '/wasm/',
            '/docs/download/',
        ];

        foreach ($allowPrefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return $next($request);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | RUTAS INTERNAS DE TAREAS
        |--------------------------------------------------------------------------
        */
        if (preg_match('#^/tareas/proyecto/#', $path) ||
            preg_match('#^/tareas/[0-9]+/historial$#', $path)
        ) {
            return $next($request);
        }

        /*
        |--------------------------------------------------------------------------
        | RUTAS PRINCIPALES DEDE INERTIA – DEVELARQ
        | (ESTO ARREGLA EL PROBLEMA DE REDIRECCIÓN A DASHBOARD)
        |--------------------------------------------------------------------------
        */
        if (str_starts_with($path, '/proyectos')) {
            return $next($request);
        }

        if (str_starts_with($path, '/users')) {
            return $next($request);
        }

        if (str_starts_with($path, '/hitos')) {
            return $next($request);
        }

        if (str_starts_with($path, '/documentos')) {
            return $next($request);
        }

        if (str_starts_with($path, '/tareas')) {
            return $next($request);
        }

        /*
        |--------------------------------------------------------------------------
        | RUTAS PERMITIDAS GENÉRICAS
        |--------------------------------------------------------------------------
        */
        $allowedExact = [
            '/',
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
            '/email/verify',
            '/dashboard',
            '/portafolio',
            '/carreras',
            '/servicios',
            '/acercadenosotros',
            '/users/verificar-duplicado',
            '/users/check-email',
            '/profile',
            '/profile/update',
        ];

        if (in_array($path, $allowedExact)) {
            return $next($request);
        }

        // Excepción: rutas como /verify-email/asdadasdas
        if (str_starts_with($path, '/verify-email/')) {
            return $next($request);
        }

        /*
        |--------------------------------------------------------------------------
        | BLOQUEO DE ACCESO MANUAL
        | (solo si no es petición Inertia/AJAX/JSON)
        |--------------------------------------------------------------------------
        */
        if (
            !$request->headers->has('X-Inertia') &&
            !$request->ajax() &&
            !$request->expectsJson()
        ) {
            Log::warning('PreventManualUrlAccess: Acceso manual bloqueado', [
                'path' => $path,
                'user_id' => optional($user)->id,
            ]);

            return redirect()->route('login');
        }

        return $next($request);
    }
}

