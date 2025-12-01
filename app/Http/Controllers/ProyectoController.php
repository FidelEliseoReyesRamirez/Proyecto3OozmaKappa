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
use App\Models\AuditoriaLog;
use App\Models\TareaHistorial;
use App\Models\Documento;
use App\Models\Hitos;

use App\Traits\RegistraAuditoria;

class ProyectoController extends Controller
{
    use RegistraAuditoria;

    /**
     * Muestra la lista de proyectos, filtrada por cliente si aplica.
     */
    public function index()
    {
        $user = Auth::user();
        $userRole = strtolower($user->rol);

        $query = Proyecto::with(['cliente', 'responsable']);

        // ADMIN: ve todos
        if ($userRole === 'admin') {
            // no se filtra nada
        }

        // CLIENTE: ve solo sus proyectos
        elseif ($userRole === 'cliente') {
            $query->where('cliente_id', $user->id);
        }

        // ARQUITECTO / INGENIERO: ver los proyectos donde participa
        else {
            $query->where(function ($q) use ($user) {

                // Es responsable del proyecto
                $q->where('responsable_id', $user->id)

                    // Está asignado en la tabla proyectos_usuarios (cualquier permiso)
                    ->orWhereIn('id', function ($sub) use ($user) {
                        $sub->select('proyecto_id')
                            ->from('proyectos_usuarios')
                            ->where('user_id', $user->id)
                            ->where('eliminado', 0);
                    })

                    // Es cliente (por si acaso)
                    ->orWhere('cliente_id', $user->id);
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
            'archivo_bim' => [
                'nullable',
                'file',
                'max:2097152',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $ext = strtolower($value->getClientOriginalExtension());
                        if (!in_array($ext, ['bim', 'ifc', 'zip', 'ifczip'])) {
                            $fail('El archivo BIM debe tener formato .bim, .ifc o .ifczip.');
                        }
                    }
                },
            ],
        ], [
            'archivo_bim.max' => 'El archivo BIM no puede superar los 1.5 GB.',
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

        // Crear el proyecto
        $proyecto = Proyecto::create([
            'nombre'         => $request->nombre,
            'cliente_id'     => $request->cliente_id,
            'descripcion'    => $request->descripcion,
            'responsable_id' => $request->responsable_id,
            'fecha_inicio'   => $request->fecha_inicio,
            'estado'         => 'activo',
            'creado_por'     => Auth::id(), // ✔ Guardar creador
        ]);

        // AUDITORÍA
        self::registrarAccionManual(
            "Creó el proyecto '{$proyecto->nombre}' con cliente #{$request->cliente_id} y responsable #{$request->responsable_id}.",
            'proyectos',
            $proyecto->id
        );

        // ---------------------------------------------------------------
        // ✔ REGISTRAR CLIENTE
        // ---------------------------------------------------------------
        $proyecto->users()->syncWithoutDetaching([
            $request->cliente_id => [
                'rol_en_proyecto' => 'cliente',
                'permiso' => 'ninguno',
                'eliminado' => 0,
            ]
        ]);

        // ---------------------------------------------------------------
        // ✔ REGISTRAR RESPONSABLE con PERMISO EDITAR
        // ---------------------------------------------------------------
        $proyecto->users()->syncWithoutDetaching([
            $request->responsable_id => [
                'rol_en_proyecto' => 'responsable',
                'permiso' => 'editar', // ✔ CORRECCIÓN
                'eliminado' => 0,
            ]
        ]);

        // ---------------------------------------------------------------
        // ✔ REGISTRAR CREADOR DEL PROYECTO con PERMISO EDITAR
        // ---------------------------------------------------------------
        $proyecto->users()->syncWithoutDetaching([
            Auth::id() => [
                'rol_en_proyecto' => 'creador',
                'permiso' => 'editar', // ✔ AGREGADO
                'eliminado' => 0,
            ]
        ]);

        // Crear hito inicial
        Hitos::create([
            'proyecto_id' => $proyecto->id,
            'nombre' => 'Proyecto iniciado',
            'fecha_hito' => now(),
            'descripcion' => 'Creación del proyecto',
            'estado' => 'completado',
            'encargado_id' => Auth::id(),
        ]);

        self::registrarAccionManual(
            "Asignó cliente, responsable y creador al proyecto '{$proyecto->nombre}'.",
            'proyectos_usuarios',
            $proyecto->id
        );

        // -----------------------------------------------------------
        // NOTIFICACIONES
        // -----------------------------------------------------------

        // Notificar responsable
        NotificationService::send(
            $request->responsable_id,
            "Se te ha asignado el proyecto: {$proyecto->nombre}",
            'proyecto',
            url('/proyectos/' . $proyecto->id),
            "Asignación de proyecto"
        );

        // Notificar cliente
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

            self::registrarAccionManual(
                "Subió archivo BIM inicial del proyecto '{$proyecto->nombre}'.",
                'planos_bim',
                $proyecto->id
            );

            NotificationService::sendToMany(
                [$request->responsable_id, $request->cliente_id],
                "Se ha subido el primer archivo BIM del proyecto '{$proyecto->nombre}'.",
                'documento',
                url('/proyectos/' . $proyecto->id),
                "Archivo BIM cargado"
            );
        }

        return redirect()->route('proyectos.index')
            ->with('success', 'Proyecto creado correctamente.');
    }


    public function show($id)
    {
        $proyecto = Proyecto::with(['cliente', 'responsable'])->find($id);

        if (!$proyecto) {
            return redirect()->route('proyectos.index')
                ->with('error', 'El proyecto solicitado no existe.');
        }

        if (strtolower(Auth::user()->rol) === 'cliente' && $proyecto->cliente_id !== Auth::id()) {
            return redirect()->route('proyectos.index')
                ->with('error', 'No tienes permiso para ver este proyecto.');
        }

        return Inertia::render('GestionProyecto/Show', [
            'proyecto' => $proyecto,
        ]);
    }




    public function edit($id)
    {
        if (strtolower(Auth::user()->rol) === 'cliente') {
            return redirect()->route('proyectos.index')
                ->with('error', 'No tienes permiso para editar proyectos.');
        }

        // Buscar proyecto
        $proyecto = Proyecto::with('cliente', 'responsable')->find($id);

        // Si no existe → redirección segura
        if (!$proyecto) {
            return redirect()->route('proyectos.index')
                ->with('error', 'El proyecto solicitado no existe.');
        }

        // Si el usuario NO pertenece al proyecto → bloqueado
        if (
            Auth::user()->rol !== 'admin' &&
            Auth::id() !== $proyecto->responsable_id &&
            !DB::table('proyectos_usuarios')
                ->where('proyecto_id', $proyecto->id)
                ->where('user_id', Auth::id())
                ->where('permiso', 'editar')
                ->exists()
        ) {
            return redirect()->route('proyectos.index')
                ->with('error', 'No estás asignado a este proyecto.');
        }

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
                'max:2097152', // 2 GB en kilobytes
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $ext = strtolower($value->getClientOriginalExtension());
                        if (!in_array($ext, ['bim', 'ifc', 'zip', 'ifczip'])) {
                            $fail('El archivo BIM debe tener formato .bim, .ifc o .ifczip.');
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

            self::registrarAccionManual("Actualizó información del proyecto '{$proyecto->nombre}' (versión {$versionActual}).", 'proyectos_versiones', $proyecto->id);
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

            self::registrarAccionManual("Subió nueva versión BIM ({$versionBim}) para el proyecto '{$proyecto->nombre}'.", 'planos_bim', $proyecto->id);
        }

        if ($descripcionCambia || $responsableCambia) {
            $proyecto->update([
                'descripcion' => $validated['descripcion'],
                'responsable_id' => $validated['responsable_id'],
            ]);

            self::registrarAccionManual("Guardó cambios generales en el proyecto '{$proyecto->nombre}'.", 'proyectos', $proyecto->id);
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

        self::registrarAccionManual("Envió notificaciones por actualización del proyecto '{$proyecto->nombre}'.", 'notificaciones', $proyecto->id);

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

        // 1) Metadatos del proyecto
        $metadatos = ProyectoVersion::where('proyecto_id', $id)
            ->with('autor:id,name')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($v) {
                return [
                    'tipo'        => 'metadato',
                    'version'     => $v->version,
                    'autor'       => optional($v->autor)->name,
                    'descripcion' => $v->descripcion_cambio,
                    'fecha'       => $v->created_at,
                ];
            });

        // 2) Versiones BIM (planos, modelos 3D, etc.)
        $bim = PlanoBim::where('proyecto_id', $id)
            ->with('uploader:id,name')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($v) {
                return [
                    'tipo'        => 'bim',
                    'version'     => $v->version,
                    'archivo'     => $v->nombre,
                    'archivo_url' => $v->archivo_url,
                    'autor'       => optional($v->uploader)->name,
                    'fecha'       => $v->created_at,
                ];
            });

        // 3) Documentos
        $docs = Documento::where('proyecto_id', $id)
            ->with('uploader:id,name')
            ->orderByDesc('fecha_subida')
            ->get()
            ->map(function ($d) {
                return [
                    'tipo'        => 'documento',
                    'archivo'     => $d->nombre,
                    'descripcion' => $d->descripcion,
                    'autor'       => optional($d->uploader)->name,
                    'fecha'       => $d->fecha_subida,
                ];
            });

        // 4) Hitos
        $hitos = Hitos::where('proyecto_id', $id)
            ->with('encargado:id,name')
            ->orderByDesc('fecha_hito')
            ->get()
            ->map(function ($h) {
                return [
                    'tipo'   => 'hito',
                    'titulo' => $h->nombre,
                    'estado' => $h->estado,
                    'fecha'  => $h->fecha_hito,
                    'autor'  => optional($h->encargado)->name,
                ];
            });

        // 5) Cambios de tareas
        $historialTareas = TareaHistorial::where('proyecto_id', $id)
            ->with('usuario:id,name')
            ->orderByDesc('fecha_cambio')
            ->get()
            ->map(function ($t) {
                return [
                    'tipo'            => 'tarea',
                    'titulo'          => $t->cambio,
                    'estado_anterior' => $t->estado_anterior,
                    'estado_nuevo'    => $t->estado_nuevo,
                    'autor'           => optional($t->usuario)->name,
                    'fecha'           => $t->fecha_cambio,
                ];
            });

        // 6) Auditoría general del sistema
        $auditoria = AuditoriaLog::where('id_registro_afectado', $id)
            ->orderByDesc('fecha_accion')
            ->get()
            ->map(function ($a) {
                return [
                    'tipo'   => 'auditoria',
                    'accion' => $a->accion,
                    'fecha'  => $a->fecha_accion,
                    'autor'  => optional(User::find($a->user_id))->name,
                ];
            });

        // COMBINAR PARA TIMELINE
        $timeline = collect()
            ->merge($metadatos)
            ->merge($bim)
            ->merge($docs)
            ->merge($hitos)
            ->merge($historialTareas)
            ->merge($auditoria)
            ->sortByDesc('fecha')    // para backend; en frontend ya se reordena horizontal
            ->values();

        return Inertia::render('GestionProyecto/Versiones', [
            'proyecto'          => $proyecto,
            'timeline'          => $timeline,
            'versionesProyecto' => $metadatos,
            'versionesBim'      => $bim,
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

        self::registrarAccionManual("Cambió el estado del proyecto '{$proyecto->nombre}' a '{$nuevoEstado}'.", 'proyectos', $proyecto->id);

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

        self::registrarAccionManual("Notificó el cambio de estado del proyecto '{$proyecto->nombre}' a los involucrados.", 'notificaciones', $proyecto->id);

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }

    public function gestionarPermisos($id)
    {
        $proyecto = Proyecto::findOrFail($id);

        if (Auth::id() !== $proyecto->responsable_id) {
            abort(403, 'No tienes permiso para gestionar este proyecto.');
        }

        $usuarios = User::where('estado', 'activo')
            ->where('eliminado', 0)
            ->where('id', '!=', $proyecto->responsable_id)
            ->select('id', 'name', 'email', 'rol')
            ->get();

        $asignaciones = DB::table('proyectos_usuarios')
            ->where('proyecto_id', $id)
            ->get();

        self::registrarAccionManual("Ingresó a gestión de permisos del proyecto '{$proyecto->nombre}'.", 'proyectos_usuarios', $proyecto->id);

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
            // NO PERMITIR QUITARLE PERMISOS AL RESPONSABLE DEL PROYECTO
            if ($permiso['user_id'] == $proyecto->responsable_id) {
                continue;
            }
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

                // Auditoría
                self::registrarAccionManual("Actualizó el permiso de usuario #{$permiso['user_id']} a '{$permiso['permiso']}' en el proyecto '{$proyecto->nombre}'.", 'proyectos_usuarios', $proyecto->id);

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

        self::registrarAccionManual("Finalizó actualización de permisos del proyecto '{$proyecto->nombre}'.", 'proyectos_usuarios', $proyecto->id);

        return redirect()->route('proyectos.index')
            ->with('success', 'Permisos actualizados correctamente.');
    }
}
