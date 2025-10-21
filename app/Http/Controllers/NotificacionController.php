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

        // Cargar solo las no eliminadas y ordenadas por fecha
        $notificaciones = Notificacion::where('user_id', $user->id)
            ->where('eliminado', 0)
            ->orderByDesc('fecha_envio')
            ->get(['id', 'mensaje', 'tipo', 'url', 'asunto', 'fecha_envio', 'leida']);

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
    public function eliminar($id)
    {
        $userId = Auth::id();
        Notificacion::where('user_id', $userId)
            ->where('id', $id)
            ->update(['eliminado' => 1]);

        return back();
    }
}
