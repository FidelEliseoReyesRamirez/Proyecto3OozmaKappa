<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PreventManualUrlAccess
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('🛰️ [PreventManualUrlAccess] Solicitud detectada', [
            'path' => $request->getPathInfo(),
            'method' => $request->method(),
            'has_inertia' => $request->headers->has('X-Inertia'),
            'user_id' => optional($request->user())->id,
        ]);

        // Excepción: permitir acceso a la carpeta WASM para web-ifc-viewer
        if (preg_match('#^/wasm/#', $request->getPathInfo())) {
            Log::info('✅ [PreventManualUrlAccess] Archivo WASM/Worker permitido', [
                'ruta' => $request->getPathInfo(),
            ]);
            return $next($request);
        }

        if (preg_match('#^/docs/download/#', $request->getPathInfo())) {
            Log::info('✅ [PreventManualUrlAccess] Descarga permitida', [
                'ruta' => $request->getPathInfo(),
            ]);
            return $next($request);
        }

        if (
            preg_match('#^/tareas/proyecto/#', $request->getPathInfo()) ||
            preg_match('#^/tareas/[0-9]+/historial$#', $request->getPathInfo())
        ) {
            Log::info('✅ [PreventManualUrlAccess] Ruta AJAX interna permitida', [
                'ruta' => $request->getPathInfo(),
                'user_id' => optional($request->user())->id,
            ]);
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
            !in_array($request->getPathInfo(), $allowed) &&
            strpos($request->getPathInfo(), '/verify-email/') !== 0
        ) {
            Log::warning('🚫 [PreventManualUrlAccess] Acceso manual bloqueado', [
                'path' => $request->getPathInfo(),
                'user_id' => optional($request->user())->id,
            ]);

            return redirect()->route('login');
        }

        return $next($request);
    }
}