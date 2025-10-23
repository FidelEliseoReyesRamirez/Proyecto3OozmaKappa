<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PreventManualUrlAccess
{
    public function handle(Request $request, Closure $next)
    {
        // Permitir acceso directo al login, welcome y dashboard
        $allowed = ['/', '/dashboard', '/login'];

        if (!$request->headers->has('X-Inertia') && !in_array($request->getPathInfo(), $allowed)) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
