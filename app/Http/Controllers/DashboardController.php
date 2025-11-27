<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Documento;
use App\Models\AuditoriaLog;
use App\Models\Tarea;
use App\Models\Meeting;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $rol = $user->rol;

        /* ==========================================================
           ESTADÍSTICAS GENERALES
        ========================================================== */
        $totalProyectos       = Proyecto::count();
        $proyectosActivos     = Proyecto::where('estado', 'activo')->count();
        $proyectosProgreso    = Proyecto::where('estado', 'en progreso')->count();
        $proyectosFinalizados = Proyecto::where('estado', 'finalizado')->count();

        $documentosPDF   = Documento::where('tipo', 'PDF')->count();
        $documentosExcel = Documento::where('tipo', 'Excel')->count();
        $documentosWord  = Documento::where('tipo', 'Word')->count();
        $documentosURL   = Documento::where('tipo', 'URL')->count();

        $usuariosTotales = User::count();

        $tareasBaja  = Tarea::where('prioridad', 'baja')->count();
        $tareasMedia = Tarea::where('prioridad', 'media')->count();
        $tareasAlta  = Tarea::where('prioridad', 'alta')->count();

        $tareasPendientes = Tarea::where('estado', 'pendiente')->count();

        $auditoriaSemana = AuditoriaLog::whereBetween(
            'fecha_accion',
            [now()->subDays(7), now()]
        )->count();

        /* ==========================================================
           AUDITORÍA POR DÍA (ÚLTIMOS 7 DÍAS)
        ========================================================== */
        $auditoriaDias = AuditoriaLog::select(
                DB::raw('DATE(fecha_accion) as fecha'),
                DB::raw('COUNT(*) as total')
            )
            ->where('fecha_accion', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('fecha')
            ->orderBy('fecha', 'ASC')
            ->get()
            ->map(fn($r) => [
                'fecha' => Carbon::parse($r->fecha)->format('d/m'),
                'total' => $r->total
            ]);

        /* Forzar días faltantes a "0" */
        $auditoriaDiasCompleto = [];
        for ($i = 6; $i >= 0; $i--) {
            $dia = Carbon::now()->subDays($i)->format('d/m');
            $valor = $auditoriaDias->firstWhere('fecha', $dia)['total'] ?? 0;
            $auditoriaDiasCompleto[] = [
                'fecha' => $dia,
                'total' => $valor
            ];
        }

        /* ==========================================================
           PROYECTOS MOSTRADOS EN TARJETAS
        ========================================================== */
        if ($rol === 'admin') {
            $proyectosListado = Proyecto::with([
                'responsable:id,name,apellido',
                'cliente:id,name,apellido'
            ])
            ->latest()
            ->take(12)
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'nombre'      => $p->nombre,
                'responsable' => $p->responsable ? $p->responsable->name : null,
                'cliente'     => $p->cliente ? $p->cliente->name : null,
            ]);
        } else {
            $proyectosListado = Proyecto::where('responsable_id', $user->id)
                ->orWhere('cliente_id', $user->id)
                ->with(['responsable:id,name', 'cliente:id,name'])
                ->take(12)
                ->get()
                ->map(fn($p) => [
                    'id'          => $p->id,
                    'nombre'      => $p->nombre,
                    'responsable' => $p->responsable ? $p->responsable->name : null,
                    'cliente'     => $p->cliente ? $p->cliente->name : null,
                ]);
        }

        /* ==========================================================
           DATOS ESPECÍFICOS POR ROL
        ========================================================== */
        $rolData = match ($rol) {
            'admin' => [
                'usuariosActivos'        => User::where('estado', 'activo')->count(),
                'proyectosFinalizados'   => $proyectosFinalizados,
                'descargasDocumentos'    => Documento::count(), // reemplazar si llevas tabla descargas
            ],

            'arquitecto' => [
                'proyectosDiseño' => Proyecto::where('responsable_id', $user->id)->count(),
                'tareasActivas'   => Tarea::where('asignado_id', $user->id)->count(),
                'planosSubidos'   => Documento::where('subido_por', $user->id)->count(),
            ],

            'ingeniero' => [
                'hitosAsignados'       => Tarea::where('asignado_id', $user->id)->count(),
                'proyectosTecnicos'    => Proyecto::where('responsable_id', $user->id)->count(),
                'reunionesProgramadas' => Meeting::count(),
            ],

            'cliente' => [
                'misProyectos'        => Proyecto::where('cliente_id', $user->id)->count(),
                'documentosRecibidos' => Documento::whereIn(
                    'proyecto_id',
                    Proyecto::where('cliente_id', $user->id)->pluck('id')
                )->count(),
            ],

            default => []
        };

        /* ==========================================================
           RETORNAR A VISTA
        ========================================================== */
        return Inertia::render('Dashboard', [
            'user'    => $user,
            'rol'     => $rol,
            'stats'   => [
                'totalProyectos'       => $totalProyectos,
                'proyectosActivos'     => $proyectosActivos,
                'proyectosProgreso'    => $proyectosProgreso,
                'proyectosFinalizados' => $proyectosFinalizados,

                'documentosPDF'   => $documentosPDF,
                'documentosExcel' => $documentosExcel,
                'documentosWord'  => $documentosWord,
                'documentosURL'   => $documentosURL,

                'usuariosTotales'   => $usuariosTotales,
                'tareasPendientes'  => $tareasPendientes,
                'auditoriaSemana'   => $auditoriaSemana,

                'tareasBaja'  => $tareasBaja,
                'tareasMedia' => $tareasMedia,
                'tareasAlta'  => $tareasAlta,

                'auditoriaDias' => $auditoriaDiasCompleto,
            ],

            'proyectos' => $proyectosListado,
            'rolData'   => $rolData,
        ]);
    }
}
