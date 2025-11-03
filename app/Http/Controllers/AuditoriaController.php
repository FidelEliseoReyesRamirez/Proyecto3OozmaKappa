<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditoriaLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AuditoriaController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditoriaLog::with('user')
            ->when($request->input('search'), function ($q, $search) {
                $q->where('accion', 'like', "%{$search}%")
                  ->orWhere('tabla_afectada', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            })
            ->when($request->input('tabla'), function ($q, $tabla) {
                $q->where('tabla_afectada', $tabla);
            })
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
