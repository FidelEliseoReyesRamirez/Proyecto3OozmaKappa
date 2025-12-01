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
    private function baseStats(): array
    {
        return [
            'totalProyectos'       => 0,
            'proyectosActivos'     => 0,
            'proyectosProgreso'    => 0,
            'proyectosFinalizados' => 0,

            'documentosPDF'   => 0,
            'documentosExcel' => 0,
            'documentosWord'  => 0,
            'documentosURL'   => 0,

            'usuariosTotales' => 0,

            'auditoriaSemana' => 0,
            'auditoriaDias'   => [],

            'tareasBaja'        => 0,
            'tareasMedia'       => 0,
            'tareasAlta'        => 0,
            'tareasPendientes'  => 0,
            'tareasEnProgreso'  => 0,
            'tareasCompletadas' => 0,
        ];
    }

    public function index()
    {
        $user = Auth::user();
        $rol  = $user->rol;

        $stats = $this->baseStats();

        if ($rol === 'admin') {
            $stats['totalProyectos']       = Proyecto::count();
            $stats['proyectosActivos']     = Proyecto::where('estado', 'activo')->count();
            $stats['proyectosProgreso']    = Proyecto::where('estado', 'en progreso')->count();
            $stats['proyectosFinalizados'] = Proyecto::where('estado', 'finalizado')->count();

            $stats['documentosPDF']   = Documento::where('tipo', 'PDF')->count();
            $stats['documentosExcel'] = Documento::where('tipo', 'Excel')->count();
            $stats['documentosWord']  = Documento::where('tipo', 'Word')->count();
            $stats['documentosURL']   = Documento::where('tipo', 'URL')->count();

            $stats['usuariosTotales'] = User::count();

            $stats['tareasPendientes']  = Tarea::where('estado', 'pendiente')->count();
            $stats['tareasEnProgreso']  = Tarea::where('estado', 'en progreso')->count();
            $stats['tareasCompletadas'] = Tarea::where('estado', 'completado')->count();

            $stats['tareasBaja']  = Tarea::where('prioridad', 'baja')->count();
            $stats['tareasMedia'] = Tarea::where('prioridad', 'media')->count();
            $stats['tareasAlta']  = Tarea::where('prioridad', 'alta')->count();

            $stats['auditoriaSemana'] = AuditoriaLog::whereBetween(
                'fecha_accion',
                [now()->subDays(7), now()]
            )->count();

            $auditoriaDias = AuditoriaLog::select(
                DB::raw('DATE(fecha_accion) as fecha'),
                DB::raw('COUNT(*) as total')
            )
                ->groupBy('fecha')
                ->orderBy('fecha', 'ASC')
                ->get();

            $stats['auditoriaDias'] = $auditoriaDias->map(fn($d) => [
                'fecha' => Carbon::parse($d->fecha)->format('d/m'),
                'total' => $d->total,
            ]);
        } else {
            $misProyectosIds = Proyecto::where('responsable_id', $user->id)
                ->orWhere('cliente_id', $user->id)
                ->pluck('id');

            $baseTareas = Tarea::whereIn('proyecto_id', $misProyectosIds);

            $stats['tareasPendientes']  = (clone $baseTareas)->where('estado', 'pendiente')->count();
            $stats['tareasEnProgreso']  = (clone $baseTareas)->where('estado', 'en progreso')->count();
            $stats['tareasCompletadas'] = (clone $baseTareas)->where('estado', 'completado')->count();

            $stats['tareasBaja']  = (clone $baseTareas)->where('prioridad', 'baja')->count();
            $stats['tareasMedia'] = (clone $baseTareas)->where('prioridad', 'media')->count();
            $stats['tareasAlta']  = (clone $baseTareas)->where('prioridad', 'alta')->count();

            $stats['documentosPDF'] = Documento::whereIn('proyecto_id', $misProyectosIds)
                ->where('tipo', 'PDF')->count();
            $stats['documentosExcel'] = Documento::whereIn('proyecto_id', $misProyectosIds)
                ->where('tipo', 'Excel')->count();
            $stats['documentosWord'] = Documento::whereIn('proyecto_id', $misProyectosIds)
                ->where('tipo', 'Word')->count();
            $stats['documentosURL'] = Documento::whereIn('proyecto_id', $misProyectosIds)
                ->where('tipo', 'URL')->count();
        }

        if ($rol === 'admin') {
            $proyectos = Proyecto::with(['responsable:id,name', 'cliente:id,name'])
                ->latest()
                ->take(12)
                ->get();
        } else {
            $proyectos = Proyecto::where('responsable_id', $user->id)
                ->orWhere('cliente_id', $user->id)
                ->get();
        }

        $rolData = match ($rol) {
            'admin' => [
                'usuariosActivos'       => User::where('estado', 'activo')->count(),
                'proyectosFinalizados'  => Proyecto::where('estado', 'finalizado')->count(),
                'descargasDocumentos'   => Documento::count(),
            ],
            'arquitecto' => [
                'proyectosDiseño' => Proyecto::where('responsable_id', $user->id)->count(),
                'tareasActivas'   => Tarea::where('asignado_id', $user->id)->count(),
                'planosSubidos'   => Documento::where('subido_por', $user->id)->count(),
            ],
            'ingeniero' => [
                'hitosAsignados'       => Tarea::where('asignado_id', $user->id)->count(),
                'proyectosTecnicos'    => Proyecto::where('responsable_id', $user->id)->count(),
                'reunionesProgramadas' => Meeting::where('creador_id', $user->id)
                    ->where('eliminado', 0)
                    ->count(),
            ],
            'cliente' => [
                'misProyectos'        => Proyecto::where('cliente_id', $user->id)->count(),
                'documentosRecibidos' => Documento::whereIn(
                    'proyecto_id',
                    Proyecto::where('cliente_id', $user->id)->pluck('id')
                )->count(),
            ],
        };

        return Inertia::render('Dashboard', [
            'user'      => $user,
            'rol'       => $rol,
            'stats'     => $stats,
            'proyectos' => $proyectos,
            'rolData'   => $rolData,
        ]);
    }

    public function statsProyecto($proyectoId)
    {
        $user = Auth::user();
        $rol  = $user->rol;

        $proyecto = Proyecto::findOrFail($proyectoId);

        if (
            $rol !== 'admin' &&
            $proyecto->responsable_id !== $user->id &&
            $proyecto->cliente_id !== $user->id
        ) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $stats = $this->baseStats();

        $baseTareas = Tarea::where('proyecto_id', $proyectoId);

        $stats['tareasPendientes']  = (clone $baseTareas)->where('estado', 'pendiente')->count();
        $stats['tareasEnProgreso']  = (clone $baseTareas)->where('estado', 'en progreso')->count();
        $stats['tareasCompletadas'] = (clone $baseTareas)->where('estado', 'completado')->count();

        $stats['tareasBaja']  = (clone $baseTareas)->where('prioridad', 'baja')->count();
        $stats['tareasMedia'] = (clone $baseTareas)->where('prioridad', 'media')->count();
        $stats['tareasAlta']  = (clone $baseTareas)->where('prioridad', 'alta')->count();

        $stats['documentosPDF'] = Documento::where('proyecto_id', $proyectoId)
            ->where('tipo', 'PDF')->count();
        $stats['documentosExcel'] = Documento::where('proyecto_id', $proyectoId)
            ->where('tipo', 'Excel')->count();
        $stats['documentosWord'] = Documento::where('proyecto_id', $proyectoId)
            ->where('tipo', 'Word')->count();
        $stats['documentosURL'] = Documento::where('proyecto_id', $proyectoId)
            ->where('tipo', 'URL')->count();

        if ($rol === 'admin') {
            $stats['auditoriaSemana'] = AuditoriaLog::where('proyecto_id', $proyectoId)
                ->whereBetween('fecha_accion', [now()->subDays(7), now()])
                ->count();

            $dias = AuditoriaLog::select(
                DB::raw('DATE(fecha_accion) as fecha'),
                DB::raw('COUNT(*) as total')
            )
                ->where('proyecto_id', $proyectoId)
                ->groupBy('fecha')
                ->orderBy('fecha', 'ASC')
                ->get();

            $stats['auditoriaDias'] = $dias->map(fn($d) => [
                'fecha' => Carbon::parse($d->fecha)->format('d/m'),
                'total' => $d->total,
            ]);
        }

        return response()->json(['stats' => $stats]);
    }
}
