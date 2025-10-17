<?php

namespace App\Http\Controllers;

use App\Models\DescargaHistorial;
use App\Models\User;
use App\Models\Documento;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DocumentoHistorialController extends Controller
{
    /**
     * Muestra el historial de descargas real desde la tabla descargas_historial.
     */
    public function showDownloadHistory()
    {
        $user = Auth::user();

        if ($user->rol !== 'admin') {
            abort(403, 'Acceso denegado. Esta función es solo para administradores.');
        }

        $history = DescargaHistorial::with([
                'documento' => function ($query) {
                    $query->select('id', 'nombre', 'proyecto_id')->with('proyecto:id,nombre');
                },
                'user:id,name' 
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                $documento = $record->documento;
                $proyecto = $documento ? $documento->proyecto : null;

                return [
                    'id' => $record->id,
                    'documento_nombre' => $documento->nombre ?? 'Documento Eliminado',
                    'proyecto_nombre' => $proyecto->nombre ?? 'Proyecto Eliminado',
                    'usuario_descarga' => $record->user->name ?? 'Usuario Eliminado',
                    'downloaded_at' => $record->created_at->format('d/m/Y H:i:s'),
                ];
            });

        return Inertia::render('Admin/Users/DownloadHistory', [ 
            'history' => $history,
        ]);
    }
}