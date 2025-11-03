<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PreventManualUrlAccess
{
    /**
     * Middleware para evitar acceso manual directo por URL.
     * Permite rutas Inertia, AJAX internas y descargas directas.
     */
    public function handle(Request $request, Closure $next)
    {
        // Registrar toda solicitud
        Log::info('🛰️ [PreventManualUrlAccess] Solicitud detectada', [
            'path' => $request->getPathInfo(),
            'method' => $request->method(),
            'has_inertia' => $request->headers->has('X-Inertia'),
            'user_id' => optional($request->user())->id,
        ]);

        // Excepción: permitir descargas directas
        if (preg_match('#^/docs/download/#', $request->getPathInfo())) {
            Log::info('✅ [PreventManualUrlAccess] Descarga permitida', [
                'ruta' => $request->getPathInfo(),
            ]);
            return $next($request);
        }

        // Excepciones para endpoints que deben funcionar con fetch() o AJAX
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

        // Rutas públicas permitidas sin autenticación
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

        // Si la solicitud no tiene cabecera Inertia y no está en la lista blanca → bloqueo
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

            // Redirigir a login si no autenticado
            return redirect()->route('login');
        }

        // ✅ Permitir continuar normalmente
        return $next($request);
    }
}
