<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Notificacion;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share('notificaciones', function () {
            if (Auth::check()) {
                return Notificacion::where('user_id', Auth::id())
                    ->where('leida', 0)
                    ->latest()
                    ->take(5)
                    ->get();
            }

            return [];
        });
    }
}
