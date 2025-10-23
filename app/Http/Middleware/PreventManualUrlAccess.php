<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PreventManualUrlAccess
{
    public function handle(Request $request, Closure $next)
    {
        /*
        |--------------------------------------------------------------------------
        | Rutas permitidas sin cabecera Inertia
        |--------------------------------------------------------------------------
        | Se incluyen rutas públicas, de autenticación y principales internas
        | para que la app funcione correctamente sin redirigir al dashboard.
        */
        $allowedExact = [
            '/',                   // Welcome
            '/dashboard',          // Panel principal
            '/login',              // Login
            '/register',           // Registro (si existe)
            '/forgot-password',    // Recuperación
            '/reset-password',     // Reset de contraseña
            '/email/verify',       // Verificación de correo
            '/portafolio',         // Públicas
            '/carreras',
            '/servicios',
            '/acercadenosotros',
        ];

        /*
        |--------------------------------------------------------------------------
        | Prefijos que pueden acceder directamente (sin X-Inertia)
        |--------------------------------------------------------------------------
        | Se permite el acceso a grupos de rutas completas (por prefijo),
        | como /docs, /proyectos, /tareas, /usuarios, /notificaciones.
        */
        $allowedPrefixes = [
            '/docs',
            '/proyectos',
            '/tareas',
            '/usuarios',
            '/notificaciones',
        ];

        $path = $request->getPathInfo();

        $isAllowedExact = in_array($path, $allowedExact);
        $isAllowedPrefix = collect($allowedPrefixes)->contains(fn($prefix) => Str::startsWith($path, $prefix));

        // Si la solicitud no es Inertia y no está permitida, redirigir
        if (!$request->headers->has('X-Inertia') && !$isAllowedExact && !$isAllowedPrefix) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
