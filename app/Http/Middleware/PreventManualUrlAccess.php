<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PreventManualUrlAccess
{
    public function handle(Request $request, Closure $next)
    {
        // Permitir acceso directo solo a rutas públicas y auth
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
        ];

        // Si NO es una petición Inertia (sin cabecera X-Inertia)
        // y no está en la lista de rutas permitidas:
        if (!$request->headers->has('X-Inertia') && !in_array($request->getPathInfo(), $allowed)) {
            // En lugar de devolver error, lo redirigimos al dashboard
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
