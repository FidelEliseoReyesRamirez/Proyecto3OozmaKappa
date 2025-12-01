<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use App\Models\TareaHistorial;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\NotificationService;
use App\Traits\RegistraAuditoria; // ← agregado

class TareaController extends Controller
{
    use RegistraAuditoria; // ← agregado

    /**
     * Muestra el tablero Kanban.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->rol === 'admin') {

            $proyectos = Proyecto::select('id', 'nombre')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {

            $proyectos = Proyecto::select('id', 'nombre')
                ->where(function ($q) use ($user) {
                    $q->where('responsable_id', $user->id)
                        ->orWhere('cliente_id', $user->id)
                        ->orWhereIn('id', function ($q2) use ($user) {
                            $q2->select('proyecto_id')
                                ->from('proyectos_usuarios')
                                ->where('user_id', $user->id);
                        });
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Tareas/Tablero', [
            'proyectos'       => $proyectos,
            'usuarios'        => [],
            'ultimoProyecto'  => $proyectos->first()?->id ?? null,
        ]);
    }



    /**
     * Obtiene las tareas y usuarios con permiso "editar" de un proyecto.
     */
    public function obtenerPorProyecto($id)
    {
        $tareas = Tarea::with(['asignado:id,name,email'])
            ->where('proyecto_id', $id)
            ->where(function ($q) {
                $q->whereNull('eliminado')->orWhere('eliminado', 0);
            })
            ->orderBy('prioridad', 'desc')
            ->get(['id', 'titulo', 'descripcion', 'estado', 'fecha_limite', 'prioridad', 'asignado_id', 'proyecto_id']);

        $usuarios = DB::table('proyectos_usuarios')
            ->join('users', 'users.id', '=', 'proyectos_usuarios.user_id')
            ->where('proyectos_usuarios.proyecto_id', $id)
            ->where('proyectos_usuarios.permiso', 'editar')
            ->where('users.estado', 'activo')
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json([
            'success' => true,
            'tareas' => $tareas,
            'usuarios' => $usuarios,
        ]);
    }


    /**
     * Muestra el formulario de creación de tarea.
     */
    public function create($proyecto_id = null)
    {
        $user = Auth::user();

        if (strtolower($user->rol) === 'cliente') {
            abort(403, 'No tienes permiso para crear tareas.');
        }

        // Lista de proyectos filtrada
        if ($user->rol === 'admin') {
            $proyectos = Proyecto::select('id', 'nombre')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $proyectos = Proyecto::select('id', 'nombre')
                ->where(function ($q) use ($user) {
                    $q->where('responsable_id', $user->id)
                        ->orWhere('cliente_id', $user->id)
                        ->orWhereIn('id', function ($q2) use ($user) {
                            $q2->select('proyecto_id')
                                ->from('proyectos_usuarios')
                                ->where('user_id', $user->id);
                        });
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $usuarios = collect();
        $responsablePorDefecto = null;

        if ($proyecto_id) {

            $proyecto = Proyecto::find($proyecto_id);

            if ($proyecto) {

                // Usuarios con permiso editar del proyecto
                $usuarios = DB::table('proyectos_usuarios')
                    ->join('users', 'users.id', '=', 'proyectos_usuarios.user_id')
                    ->where('proyectos_usuarios.proyecto_id', $proyecto_id)
                    ->where('proyectos_usuarios.permiso', 'editar')
                    ->where('users.estado', 'activo')
                    ->where('users.eliminado', 0)
                    ->select('users.id', 'users.name', 'users.email')
                    ->get();

                // PRIORIDAD PARA RESPONSABLE DEFECTO
                if ($proyecto->responsable_id) {
                    $responsablePorDefecto = $proyecto->responsable_id;
                } else {
                    // creador del proyecto
                    $responsablePorDefecto = $proyecto->creado_por ?? null;
                }

                // Si aún no hay, tomar el primer usuario permitido
                if (!$responsablePorDefecto && $usuarios->count() > 0) {
                    $responsablePorDefecto = $usuarios->first()->id;
                }
            }
        }

        return Inertia::render('Tareas/Form', [
            'proyectos' => $proyectos,
            'usuarios'  => $usuarios,
            'proyectoSeleccionado' => $proyecto_id,
            'responsablePorDefecto' => $responsablePorDefecto
        ]);
    }


    /**
     * Guarda una nueva tarea.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'proyecto_id' => 'required|exists:proyectos,id',
                'titulo' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'fecha_limite' => 'required|date',
                'prioridad' => 'required|in:baja,media,alta',
                'asignado_id' => 'required|exists:users,id',
            ]);

            $asignadoValido = DB::table('proyectos_usuarios')
                ->join('users', 'users.id', '=', 'proyectos_usuarios.user_id')
                ->where('proyectos_usuarios.proyecto_id', $validated['proyecto_id'])
                ->where('proyectos_usuarios.user_id', $validated['asignado_id'])
                ->where('proyectos_usuarios.permiso', 'editar')
                ->where('users.estado', 'activo')
                ->exists();

            if (!$asignadoValido) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Este usuario no tiene permiso de acceder a esta tarea.'
                ], 403);
            }

            $tarea = Tarea::create([
                'proyecto_id' => $validated['proyecto_id'],
                'titulo' => $validated['titulo'],
                'descripcion' => $validated['descripcion'] ?? '',
                'fecha_limite' => $validated['fecha_limite'],
                'prioridad' => $validated['prioridad'],
                'asignado_id' => $validated['asignado_id'],
                'estado' => 'pendiente',
                'creado_por' => Auth::id(),
                'eliminado' => 0,
            ]);

            // AUDITORÍA: creación de tarea
            self::registrarAccionManual("Creó la tarea '{$tarea->titulo}' en el proyecto #{$tarea->proyecto_id} asignada al usuario #{$tarea->asignado_id}.", 'tareas', $tarea->id);

            TareaHistorial::create([
                'proyecto_id' => $tarea->proyecto_id,
                'tarea_id' => $tarea->id,
                'usuario_id' => Auth::id(),
                'estado_anterior' => 'pendiente',
                'estado_nuevo' => null,
                'cambio' => 'Creación de la tarea (estado inicial pendiente)',
                'fecha_cambio' => now(),
            ]);

            // 🔔 NOTIFICACIONES AL CREAR TAREA
            $proyecto = Proyecto::find($tarea->proyecto_id);
            $responsable = $proyecto->responsable_id ?? null;
            $cliente = $proyecto->cliente_id ?? null;

            $colaboradores = DB::table('proyectos_usuarios')
                ->where('proyecto_id', $proyecto->id)
                ->where('permiso', 'editar')
                ->pluck('user_id')
                ->toArray();

            $destinatarios = array_unique(array_filter(array_merge(
                [$tarea->asignado_id, $tarea->creado_por],
                [$responsable, $cliente],
                $colaboradores
            )));

            NotificationService::sendToMany(
                $destinatarios,
                "Se ha creado la tarea '{$tarea->titulo}' en el proyecto '{$proyecto->nombre}'.",
                'tarea',
                url('/proyectos/' . $proyecto->id),
                'Nueva tarea creada'
            );

            return redirect()->route('tareas.index', [
                'proyecto_id' => $validated['proyecto_id']
            ])->with('success', 'Tarea creada correctamente ✅');
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ocurrió un error al crear la tarea.',
                'debug' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambia el estado de una tarea (para el Kanban).
     */
    public function actualizarEstado(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);
        $estadoAnterior = $tarea->estado;
        $nuevoEstado = $request->input('estado');

        if (!in_array($nuevoEstado, ['pendiente', 'en progreso', 'completado'])) {
            return response()->json(['error' => 'Estado no válido.'], 422);
        }

        if ($estadoAnterior !== $nuevoEstado) {
            $tarea->update(['estado' => $nuevoEstado]);

            TareaHistorial::create([
                'proyecto_id' => $tarea->proyecto_id,
                'tarea_id' => $tarea->id,
                'usuario_id' => Auth::id(),
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $nuevoEstado,
                'cambio' => "Cambio de estado: {$estadoAnterior} → {$nuevoEstado}",
                'fecha_cambio' => now(),
            ]);

            // AUDITORÍA: cambio de estado
            self::registrarAccionManual("Actualizó el estado de la tarea '{$tarea->titulo}' de '{$estadoAnterior}' a '{$nuevoEstado}'.", 'tareas', $tarea->id);

            // 🔔 NOTIFICACIONES AL CAMBIAR ESTADO
            $proyecto = Proyecto::find($tarea->proyecto_id);
            $responsable = $proyecto->responsable_id ?? null;
            $cliente = $proyecto->cliente_id ?? null;

            $colaboradores = DB::table('proyectos_usuarios')
                ->where('proyecto_id', $proyecto->id)
                ->where('permiso', 'editar')
                ->pluck('user_id')
                ->toArray();

            $destinatarios = array_unique(array_merge(
                [$tarea->asignado_id, $tarea->creado_por],
                [$responsable, $cliente],
                $colaboradores
            ));

            $mensaje = "La tarea '{$tarea->titulo}' ha cambiado de estado: {$estadoAnterior} → {$nuevoEstado}.";

            NotificationService::sendToMany(
                $destinatarios,
                $mensaje,
                'tarea',
                url('/proyectos/' . $proyecto->id),
                'Actualización de tarea'
            );
        }

        return back()->with('success', 'Estado de la tarea actualizado correctamente.');
    }

    /**
     * Devuelve el historial de una tarea.
     */
    public function historial($id)
    {
        $historial = TareaHistorial::where('tarea_id', $id)
            ->with(['usuario', 'proyecto'])
            ->orderByDesc('fecha_cambio')
            ->get();

        return response()->json($historial);
    }
}
