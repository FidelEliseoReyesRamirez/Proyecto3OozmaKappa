<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PreventManualUrlAccess
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('PreventManualUrlAccess: Solicitud detectada', [
            'path' => $request->getPathInfo(),
            'method' => $request->method(),
            'has_inertia' => $request->headers->has('X-Inertia'),
            'user_id' => optional($request->user())->id,
        ]);

        $path = $request->getPathInfo();

        /*
        |--------------------------------------------------------------------------
        | EXCEPCIONES NECESARIAS PARA UNITY VIEWER
        |--------------------------------------------------------------------------
        | Permitimos:
        | - /planos/3d/*
        | - /planos/*
        | - /Build/*
        | - /StreamingAssets/*
        | - /storage/planos/*
        */

        if (preg_match('#^/planos/#', $path)) {
            return $next($request);
        }

        if (preg_match('#^/Build/#', $path)) {
            return $next($request);
        }

        if (preg_match('#^/StreamingAssets/#', $path)) {
            return $next($request);
        }

        if (preg_match('#^/storage/planos/#', $path)) {
            return $next($request);
        }

        if (preg_match('#^/wasm/#', $path)) {
            return $next($request);
        }

        if (preg_match('#^/docs/download/#', $path)) {
            return $next($request);
        }

        if (
            preg_match('#^/tareas/proyecto/#', $path) ||
            preg_match('#^/tareas/[0-9]+/historial$#', $path)
        ) {
            return $next($request);
        }

        $allowed = [
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

        if (
            !$request->headers->has('X-Inertia') &&
            !$request->ajax() &&
            !$request->expectsJson() &&
            !in_array($path, $allowed) &&
            strpos($path, '/verify-email/') !== 0
        ) {
            Log::warning('PreventManualUrlAccess: Acceso manual bloqueado', [
                'path' => $path,
                'user_id' => optional($request->user())->id,
            ]);

            return redirect()->route('login');
        }

        return $next($request);
    }
}
