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

class TareaController extends Controller
{
    /**
     * Muestra el tablero Kanban.
     */
    public function index()
    {
        $proyectos = Proyecto::select('id', 'nombre')->get();

        // No cargamos usuarios todavía, ya que dependen del proyecto seleccionado
        $usuarios = [];

        return Inertia::render('Tareas/Tablero', [
            'proyectos' => $proyectos,
            'usuarios' => $usuarios,
        ]);
    }

    /**
     * Obtiene las tareas y usuarios con permiso "editar" de un proyecto.
     */
    public function obtenerPorProyecto($id)
    {
        $tareas = Tarea::with(['asignado'])
            ->where('proyecto_id', $id)
            ->orderBy('prioridad', 'desc')
            ->get();

        // 🧠 Solo usuarios con permiso "editar" y activos
        $usuarios = DB::table('proyectos_usuarios')
            ->join('users', 'users.id', '=', 'proyectos_usuarios.user_id')
            ->where('proyectos_usuarios.proyecto_id', $id)
            ->where('proyectos_usuarios.permiso', 'editar')
            ->where('users.estado', 'activo')
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json([
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
            return redirect()->route('tareas.index')->with('error', 'No tienes permiso para crear tareas.');
        }

        $proyectos = Proyecto::select('id', 'nombre')->get();

        $usuarios = collect();

        // Si ya se seleccionó un proyecto, filtrar usuarios con permiso 'editar'
        if ($proyecto_id) {
            $usuarios = DB::table('proyectos_usuarios')
                ->join('users', 'users.id', '=', 'proyectos_usuarios.user_id')
                ->where('proyectos_usuarios.proyecto_id', $proyecto_id)
                ->where('proyectos_usuarios.permiso', 'editar')
                ->where('users.estado', 'activo')
                ->select('users.id', 'users.name', 'users.email')
                ->get();
        }

        return Inertia::render('Tareas/Form', [
            'proyectos' => $proyectos,
            'usuarios' => $usuarios,
            'proyectoSeleccionado' => $proyecto_id,
        ]);
    }

    /**
     * Guarda una nueva tarea.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'proyecto_id' => 'required|exists:proyectos,id',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_limite' => 'required|date',
            'prioridad' => 'required|in:baja,media,alta',
            'asignado_id' => 'required|exists:users,id',
        ]);

        // 🧠 Verificar que el usuario asignado esté activo y tenga permiso 'editar' en ese proyecto
        $asignadoValido = DB::table('proyectos_usuarios')
            ->join('users', 'users.id', '=', 'proyectos_usuarios.user_id')
            ->where('proyectos_usuarios.proyecto_id', $validated['proyecto_id'])
            ->where('proyectos_usuarios.user_id', $validated['asignado_id'])
            ->where('proyectos_usuarios.permiso', 'editar')
            ->where('users.estado', 'activo')
            ->exists();

        if (!$asignadoValido) {
            return redirect()->back()->with('error', 'El usuario asignado no tiene permiso o no está activo.');
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
        ]);

        // 🧠 Historial inicial
        TareaHistorial::create([
            'proyecto_id' => $tarea->proyecto_id,
            'tarea_id' => $tarea->id,
            'usuario_id' => Auth::id(),
            'estado_anterior' => 'pendiente',
            'estado_nuevo' => null,
            'cambio' => 'Creación de la tarea (estado inicial pendiente)',
            'fecha_cambio' => now(),
        ]);

        return redirect()->route('tareas.index')->with('success', 'Tarea creada correctamente.');
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
        }

        return response()->json(['success' => true]);
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
