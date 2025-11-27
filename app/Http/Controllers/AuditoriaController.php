<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditoriaLog;
use Inertia\Inertia;

class AuditoriaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tabla  = $request->input('tabla');

        $query = AuditoriaLog::with('user')
            ->when($search, function ($q) use ($search) {
                $q->where(function($q) use ($search) {
                    $q->where('accion', 'like', "%{$search}%")
                      ->orWhere('descripcion_detallada', 'like', "%{$search}%")
                      ->orWhere('ip_address', 'like', "%{$search}%")
                      ->orWhere('id_registro_afectado', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => 
                          $u->where('name', 'like', "%{$search}%")
                      );
                });
            })
            ->when($tabla, fn($q) => 
                $q->where('tabla_afectada', $tabla)
            )
            ->orderBy('fecha_accion', 'desc');

        $auditorias = $query->paginate(15)->withQueryString();

        $tablas = AuditoriaLog::select('tabla_afectada')
            ->distinct()
            ->pluck('tabla_afectada')
            ->filter()
            ->values();

        return Inertia::render('Audit/Index', [
            'auditorias' => $auditorias,
            'filtros' => $request->only(['search', 'tabla']),
            'tablas' => $tablas,
        ]);
    }
}
