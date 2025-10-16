<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Proyecto;
use App\Models\User;
use App\Models\PlanoBim;
use App\Models\ProyectoVersion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Services\NotificationService;

class ProyectoController extends Controller
{
    /**
     * Muestra la lista de proyectos, filtrada por cliente si aplica.
     */
    public function index()
    {
        $user = Auth::user();
        $userRole = strtolower($user->rol);

        $query = Proyecto::with(['cliente', 'responsable']);

        if ($userRole === 'cliente') {
            $query->where('cliente_id', $user->id);
        }

        $proyectos = $query->get();

        return Inertia::render('GestionProyecto/Index', [
            'proyectos' => $proyectos,
            'userRole' => $userRole,
        ]);
    }

    public function create()
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            return redirect()->route('proyectos.index')->with('error', 'No tienes permiso para crear proyectos.');
        }

        $clientes = User::where('rol', 'cliente')->get();
        $responsables = User::whereIn('rol', ['arquitecto', 'ingeniero', 'admin'])->get();

        return Inertia::render('GestionProyecto/Form', [
            'clientes' => $clientes,
            'responsables' => $responsables,
        ]);
    }

    public function store(Request $request)
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            return redirect()->route('proyectos.index')->with('error', 'No tienes permiso para almacenar proyectos.');
        }

        $request->validate([
            'nombre' => 'required|string|max:150|unique:proyectos,nombre',
            'cliente_id' => 'required|exists:users,id',
            'descripcion' => 'nullable|string',
            'responsable_id' => 'required|exists:users,id',
            'fecha_inicio' => 'required|date',
            'archivo_bim' => 'nullable|file',
        ]);

        $proyecto = Proyecto::create([
            'nombre' => $request->nombre,
            'cliente_id' => $request->cliente_id,
            'descripcion' => $request->descripcion,
            'responsable_id' => $request->responsable_id,
            'fecha_inicio' => $request->fecha_inicio,
            'estado' => 'activo',
        ]);

        $proyecto->users()->syncWithoutDetaching([
            $request->cliente_id => [
                'rol_en_proyecto' => 'cliente',
                'eliminado' => 0
            ]
        ]);

        $proyecto->users()->syncWithoutDetaching([
            $request->responsable_id => [
                'rol_en_proyecto' => 'responsable',
                'eliminado' => 0
            ]
        ]);

        NotificationService::send(
            $request->responsable_id,
            "Se te ha asignado el proyecto: {$proyecto->nombre}",
            'tarea'
        );

        NotificationService::send(
            $request->cliente_id,
            "Tu proyecto '{$proyecto->nombre}' ha sido creado.",
            'tarea'
        );

        if ($request->hasFile('archivo_bim')) {
            $path = $request->file('archivo_bim')->store('planos_bim', 'public');
            PlanoBim::create([
                'proyecto_id' => $proyecto->id,
                'nombre' => $request->file('archivo_bim')->getClientOriginalName(),
                'archivo_url' => $path,
                'version' => 'v1.0',
                'subido_por' => Auth::id(),
            ]);
        }

        return redirect()->route('proyectos.index')->with('success', 'Proyecto creado correctamente.');
    }

    public function edit($id)
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            abort(403, 'No tienes permiso para editar proyectos.');
        }

        $proyecto = Proyecto::with('cliente', 'responsable')->findOrFail($id);
        $clientes = User::where('rol', 'cliente')->get();
        $responsables = User::whereIn('rol', ['arquitecto', 'ingeniero', 'admin'])->get();

        return Inertia::render('GestionProyecto/Edit', [
            'proyecto' => $proyecto,
            'clientes' => $clientes,
            'responsables' => $responsables,
        ]);
    }
    public function update(Request $request, $id)
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            abort(403, 'No tienes permiso para actualizar proyectos.');
        }

        $proyecto = Proyecto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'responsable_id' => ['required', 'exists:users,id'],
            'cliente_id' => ['required', 'exists:users,id'],
            'fecha_inicio' => ['required', 'date'],
            'archivo_bim' => ['nullable', 'file', 'mimes:bim,ifc', 'max:5242880'],
        ]);

        $ultimaVersion = ProyectoVersion::where('proyecto_id', $proyecto->id)
            ->orderByDesc('id')
            ->first();
        $nuevoNumero = $ultimaVersion ? intval(explode('.', ltrim($ultimaVersion->version, 'v'))[0]) + 1 : 1;
        $versionActual = 'v' . $nuevoNumero . '.0';

        ProyectoVersion::create([
            'proyecto_id' => $proyecto->id,
            'descripcion_cambio' => 'Actualización del proyecto por ' . Auth::user()->name,
            'autor_id' => Auth::id(),
            'version' => $versionActual,
            'datos_previos' => json_encode([
                'descripcion' => $proyecto->descripcion,
                'responsable_id' => $proyecto->responsable_id,
                'fecha' => now()->toDateTimeString(),
            ]),
        ]);
        $proyecto->update([
            'descripcion' => $validated['descripcion'],
            'responsable_id' => $validated['responsable_id'],
        ]);

        if ($request->hasFile('archivo_bim')) {
            $versionBimActual = PlanoBim::where('proyecto_id', $proyecto->id)->count();
            $versionBim = 'v' . ($versionBimActual + 1) . '.0';

            $path = $request->file('archivo_bim')->store('planos_bim', 'public');

            PlanoBim::create([
                'proyecto_id' => $proyecto->id,
                'nombre' => $request->file('archivo_bim')->getClientOriginalName(),
                'archivo_url' => $path,
                'version' => $versionBim,
                'subido_por' => Auth::id(),
            ]);
        }
        NotificationService::send(
            $proyecto->responsable_id,
            "El proyecto '{$proyecto->nombre}' ha sido actualizado.",
            'avance'
        );
        return redirect()->route('proyectos.index')->with('success', 'Se ha creado una nueva versión del proyecto.');
    }


    public function versiones($id)
    {
        $proyecto = Proyecto::findOrFail($id);
        if (strtolower(Auth::user()->rol) === 'cliente' && $proyecto->cliente_id !== Auth::id()) {
            abort(403, 'No tienes permiso para ver las versiones de este proyecto.');
        }

        $versionesProyecto = ProyectoVersion::where('proyecto_id', $id)
            ->with('autor')
            ->orderByDesc('created_at')
            ->get();

        $versionesBim = PlanoBim::where('proyecto_id', $id)
            ->with('subidoPor')
            ->orderByDesc('created_at')
            ->get();

        return inertia('GestionProyecto/Versiones', [
            'proyecto' => $proyecto,
            'versionesProyecto' => $versionesProyecto,
            'versionesBim' => $versionesBim,
        ]);
    }
    public function cambiarEstado(Request $request, $id)
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            abort(403, 'No tienes permiso para cambiar el estado de los proyectos.');
        }

        $request->validate([
            'estado' => 'required|in:activo,en progreso,finalizado',
        ]);

        $proyecto = Proyecto::findOrFail($id);

        $nuevoEstado = $request->estado;
        $datos = ['estado' => $nuevoEstado];

        if ($nuevoEstado === 'finalizado') {
            $datos['fecha_fin'] = now()->toDateString();
        }

        $proyecto->update($datos);

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }
}
