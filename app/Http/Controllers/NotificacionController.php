<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificacionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $notificaciones = $user->notificaciones;

        return inertia('Notificaciones/Index', [
            'notificaciones' => $notificaciones
        ]);
    }

    public function marcarComoLeida($id)
    {
        $userId = Auth::id();

        Notificacion::where('user_id', $userId)
            ->where('id', $id)
            ->update(['leida' => 1]);

        return back();
    }

    public function marcarTodasComoLeidas()
    {
        $userId = Auth::id();

        Notificacion::where('user_id', $userId)
            ->update(['leida' => 1]);

        return back();
    }
}
