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
use Illuminate\Support\Facades\DB;
use App\Models\HistorialPermiso;

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
        if ($userRole === 'admin') {
        } elseif (in_array($userRole, ['arquitecto', 'ingeniero', 'admin'])) {
            $query->whereIn('id', function ($q) use ($user) {
                $q->select('proyecto_id')
                    ->from('proyectos_usuarios')
                    ->where('user_id', $user->id)
                    ->where('permiso', 'editar');
            });
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

        $clientes = User::where('rol', 'cliente')
            ->where('estado', 'activo')
            ->where('eliminado', 0)
            ->get();

        $responsables = User::whereIn('rol', ['arquitecto', 'ingeniero', 'admin'])
            ->where('estado', 'activo')
            ->where('eliminado', 0)
            ->get();

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

        $clienteActivo = User::where('id', $request->cliente_id)
            ->where('estado', 'activo')
            ->exists();

        $responsableActivo = User::where('id', $request->responsable_id)
            ->where('estado', 'activo')
            ->exists();

        if (!$clienteActivo || !$responsableActivo) {
            return redirect()->back()->with('error', 'El cliente o responsable seleccionado no está activo.');
        }

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

        // -----------------------------------------------------------
        // NOTIFICACIONES AL CREAR PROYECTO
        // -----------------------------------------------------------

        // Notificar al responsable
        NotificationService::send(
            $request->responsable_id,
            "Se te ha asignado el proyecto: {$proyecto->nombre}",
            'proyecto',
            url('/proyectos/' . $proyecto->id),
            "Asignación de proyecto"
        );

        // Notificar al cliente
        NotificationService::send(
            $request->cliente_id,
            "Tu proyecto '{$proyecto->nombre}' ha sido creado correctamente.",
            'proyecto',
            url('/proyectos/' . $proyecto->id),
            "Proyecto creado"
        );

        // Si hay archivo BIM
        if ($request->hasFile('archivo_bim')) {
            $path = $request->file('archivo_bim')->store('planos_bim', 'public');
            PlanoBim::create([
                'proyecto_id' => $proyecto->id,
                'nombre' => $request->file('archivo_bim')->getClientOriginalName(),
                'archivo_url' => $path,
                'version' => 'v1.0',
                'subido_por' => Auth::id(),
            ]);

            // Notificar subida de archivo BIM
            NotificationService::sendToMany(
                [$request->responsable_id, $request->cliente_id],
                "Se ha subido el primer archivo BIM del proyecto '{$proyecto->nombre}'.",
                'documento',
                url('/proyectos/' . $proyecto->id),
                "Archivo BIM cargado"
            );
        }

        return redirect()->route('proyectos.index')->with('success', 'Proyecto creado correctamente.');
    }
    public function show($id)
    {
        // Buscar el proyecto, o devolver 404 si no existe
        $proyecto = Proyecto::with(['cliente', 'responsable'])->find($id);

        if (!$proyecto) {
            abort(404, 'Proyecto no encontrado');
        }

        // Verificación de permisos
        if (strtolower(Auth::user()->rol) === 'cliente' && $proyecto->cliente_id !== Auth::id()) {
            abort(403, 'No tienes permiso para ver este proyecto.');
        }

        return Inertia::render('GestionProyecto/Show', [
            'proyecto' => $proyecto,
        ]);
    }



    public function edit($id)
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            abort(403, 'No tienes permiso para editar proyectos.');
        }

        $proyecto = Proyecto::with('cliente', 'responsable')->findOrFail($id);

        $clientes = User::where('rol', 'cliente')
            ->where('estado', 'activo')
            ->where('eliminado', 0)
            ->get();

        $responsables = User::whereIn('rol', ['arquitecto', 'ingeniero', 'admin'])
            ->where('estado', 'activo')
            ->where('eliminado', 0)
            ->get();

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

        $messages = [
            'archivo_bim.mimetypes' => 'El archivo BIM debe tener formato .bim o .ifc.',
            'archivo_bim.max' => 'El archivo BIM no puede superar los 256 MB.',
        ];

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'responsable_id' => ['required', 'exists:users,id'],
            'cliente_id' => ['required', 'exists:users,id'],
            'fecha_inicio' => ['required', 'date'],
            'archivo_bim' => [
                'nullable',
                'file',
                'max:262144',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $ext = strtolower($value->getClientOriginalExtension());
                        if (!in_array($ext, ['bim', 'ifc'])) {
                            $fail('El archivo BIM debe tener formato .bim o .ifc.');
                        }
                    }
                },
            ],
        ], $messages);

        $descripcionCambia = trim($proyecto->descripcion ?? '') !== trim($validated['descripcion'] ?? '');
        $responsableCambia = $proyecto->responsable_id != $validated['responsable_id'];
        $hayArchivoNuevo = $request->hasFile('archivo_bim');
        $mantieneArchivo = $request->boolean('mantener_archivo');

        if (!$descripcionCambia && !$responsableCambia && !$hayArchivoNuevo && $mantieneArchivo) {
            return redirect()->route('proyectos.index')
                ->with('info', 'No se detectaron cambios en el proyecto.');
        }

        $versionInfoCreada = false;

        if ($descripcionCambia || $responsableCambia) {
            $ultimaVersion = ProyectoVersion::where('proyecto_id', $proyecto->id)
                ->orderByDesc('id')
                ->first();
            $nuevoNumero = $ultimaVersion
                ? intval(explode('.', ltrim($ultimaVersion->version, 'v'))[0]) + 1
                : 1;
            $versionActual = 'v' . $nuevoNumero . '.0';

            ProyectoVersion::create([
                'proyecto_id' => $proyecto->id,
                'descripcion_cambio' => 'Actualización de información del proyecto por ' . Auth::user()->name,
                'autor_id' => Auth::id(),
                'version' => $versionActual,
                'datos_previos' => json_encode([
                    'descripcion' => $proyecto->descripcion,
                    'responsable_id' => $proyecto->responsable_id,
                    'fecha' => now()->toDateTimeString(),
                ]),
            ]);

            $versionInfoCreada = true;
        }

        if ($hayArchivoNuevo) {
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

        if ($descripcionCambia || $responsableCambia) {
            $proyecto->update([
                'descripcion' => $validated['descripcion'],
                'responsable_id' => $validated['responsable_id'],
            ]);
        }

        // -----------------------------------------------------------
        // NOTIFICACIONES AL ACTUALIZAR PROYECTO
        // -----------------------------------------------------------

        // Obtener colaboradores (todos los user_id con permiso editar)
        $colaboradores = DB::table('proyectos_usuarios')
            ->where('proyecto_id', $proyecto->id)
            ->where('permiso', 'editar')
            ->pluck('user_id')
            ->toArray();

        $destinatarios = array_merge([$proyecto->responsable_id, $proyecto->cliente_id], $colaboradores);

        NotificationService::sendToMany(
            $destinatarios,
            "El proyecto '{$proyecto->nombre}' ha sido actualizado.",
            'avance',
            url('/proyectos/' . $proyecto->id),
            'Proyecto actualizado'
        );

        return redirect()->route('proyectos.index')
            ->with('success', $versionInfoCreada && $hayArchivoNuevo
                ? 'Se han creado nuevas versiones de información y documento BIM.'
                : ($versionInfoCreada
                    ? 'Se ha creado una nueva versión de información del proyecto.'
                    : 'Se ha creado una nueva versión del documento BIM.'));
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

        // Notificar cambio de estado a cliente, responsable y colaboradores
        $colaboradores = DB::table('proyectos_usuarios')
            ->where('proyecto_id', $proyecto->id)
            ->where('permiso', 'editar')
            ->pluck('user_id')
            ->toArray();

        $destinatarios = array_merge([$proyecto->responsable_id, $proyecto->cliente_id], $colaboradores);

        NotificationService::sendToMany(
            $destinatarios,
            "El proyecto '{$proyecto->nombre}' ha cambiado de estado a '{$nuevoEstado}'.",
            'proyecto',
            url('/proyectos/' . $proyecto->id),
            'Estado del proyecto actualizado'
        );

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }

    public function gestionarPermisos($id)
    {
        $proyecto = Proyecto::findOrFail($id);

        if (Auth::id() !== $proyecto->responsable_id) {
            abort(403, 'No tienes permiso para gestionar este proyecto.');
        }

        $usuarios = User::whereIn('rol', ['arquitecto', 'ingeniero'])
            ->where('id', '!=', $proyecto->responsable_id)
            ->where('estado', 'activo')
            ->select('id', 'name', 'email')
            ->get();

        $asignaciones = DB::table('proyectos_usuarios')
            ->where('proyecto_id', $id)
            ->get();

        return Inertia::render('GestionProyecto/Permisos', [
            'proyecto' => $proyecto,
            'usuarios' => $usuarios,
            'asignaciones' => $asignaciones,
        ]);
    }

    public function actualizarPermisos(Request $request, $id)
    {
        $proyecto = Proyecto::findOrFail($id);

        if (Auth::id() !== $proyecto->responsable_id) {
            abort(403, 'No tienes permiso para editar permisos en este proyecto.');
        }

        $request->validate([
            'permisos' => 'required|array',
            'permisos.*.user_id' => 'required|exists:users,id',
            'permisos.*.permiso' => 'required|in:ninguno,editar',
        ]);

        foreach ($request->permisos as $permiso) {
            $actual = DB::table('proyectos_usuarios')
                ->where('proyecto_id', $proyecto->id)
                ->where('user_id', $permiso['user_id'])
                ->value('permiso');
            $usuarioValido = User::where('id', $permiso['user_id'])
                ->where('estado', 'activo')
                ->exists();

            if (!$usuarioValido) {
                continue;
            }

            if ($actual !== $permiso['permiso']) {
                DB::table('proyectos_usuarios')
                    ->updateOrInsert(
                        ['proyecto_id' => $proyecto->id, 'user_id' => $permiso['user_id']],
                        ['permiso' => $permiso['permiso'], 'asignado_en' => now()]
                    );

                HistorialPermiso::create([
                    'proyecto_id' => $proyecto->id,
                    'usuario_modificador_id' => Auth::id(),
                    'usuario_afectado_id' => $permiso['user_id'],
                    'permiso_asignado' => $permiso['permiso'],
                    'fecha_cambio' => now(),
                ]);

                // Notificar al usuario afectado
                NotificationService::send(
                    $permiso['user_id'],
                    "Se te ha asignado permiso '{$permiso['permiso']}' en el proyecto '{$proyecto->nombre}'.",
                    'proyecto',
                    url('/proyectos/' . $proyecto->id),
                    'Permiso actualizado'
                );
            }
        }

        return redirect()->route('proyectos.index')
            ->with('success', 'Permisos actualizados correctamente.');
    }
}
