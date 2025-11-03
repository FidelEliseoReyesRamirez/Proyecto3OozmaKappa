<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PreventManualUrlAccess
{
    /**
     * Middleware para evitar acceso manual directo por URL.
     * Permite rutas Inertia, públicas y descargas directas.
     */
    public function handle(Request $request, Closure $next)
    {
        // Registrar cada solicitud entrante
        Log::info('🛰️ [PreventManualUrlAccess] Solicitud detectada', [
            'path' => $request->getPathInfo(),
            'method' => $request->method(),
            'has_inertia' => $request->headers->has('X-Inertia'),
            'user_id' => optional($request->user())->id,
        ]);

        // Excepción: permitir descargas de documentos
        if (preg_match('#^/docs/download/#', $request->getPathInfo())) {
            Log::info('✅ [PreventManualUrlAccess] Descarga permitida', [
                'ruta' => $request->getPathInfo(),
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

        ];

        // Si la petición no es Inertia y no está en la lista blanca → redirigir
        if (
            !$request->headers->has('X-Inertia') &&
            !in_array($request->getPathInfo(), $allowed)
            && strpos($request->getPathInfo(), '/verify-email/') !== 0
        ) {
            Log::warning('🚫 [PreventManualUrlAccess] Acceso manual bloqueado', [
                'path' => $request->getPathInfo(),
                'user_id' => optional($request->user())->id,
            ]);
            // Redirige al dashboard en lugar de error 403
            return redirect()->route('login');
        }

        // Permitir continuar normalmente
        return $next($request);
    }
}
