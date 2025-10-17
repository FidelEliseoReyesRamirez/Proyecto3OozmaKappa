<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use App\Models\TareaHistorial;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TareaController extends Controller
{
    public function index()
    {
        $proyectos = Proyecto::select('id', 'nombre')->get();
        $usuarios = User::whereIn('rol', ['arquitecto', 'ingeniero', 'admin'])->get();

        return Inertia::render('Tareas/Tablero', [
            'proyectos' => $proyectos,
            'usuarios' => $usuarios,
        ]);
    }

    public function obtenerPorProyecto($id)
    {
        $tareas = Tarea::with(['asignado'])
            ->where('proyecto_id', $id)
            ->orderBy('prioridad', 'desc')
            ->get();

        return response()->json($tareas);
    }

    public function create($proyecto_id = null)
    {
        $user = Auth::user();

        if (strtolower($user->rol) === 'cliente') {
            return redirect()->route('tareas.index')->with('error', 'No tienes permiso para crear tareas.');
        }

        $proyectos = Proyecto::select('id', 'nombre')->get();
        $usuarios = User::whereIn('rol', ['arquitecto', 'ingeniero', 'admin'])->get();

        return inertia('Tareas/Form', [
            'proyectos' => $proyectos,
            'usuarios' => $usuarios,
            'proyectoSeleccionado' => $proyecto_id,
        ]);
    }

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

        // 🧠 Historial inicial — con proyecto_id
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

        return redirect()->back();
    }

    public function historial($id)
    {
        $historial = TareaHistorial::where('tarea_id', $id)
            ->with(['usuario', 'proyecto'])
            ->orderByDesc('fecha_cambio')
            ->get();

        return response()->json($historial);
    }
}
