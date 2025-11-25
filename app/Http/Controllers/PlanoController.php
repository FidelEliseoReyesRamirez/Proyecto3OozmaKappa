<?php

namespace App\Http\Controllers;

use App\Models\PlanoBim;
use App\Models\Proyecto;
use App\Models\AuditoriaLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Services\NotificationService;
use App\Models\DescargaHistorial;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\FbxConverterService;


class PlanoController extends Controller
{
    /**
     * Muestra la lista de planos BIM filtrados por rol y proyectos asociados.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = strtolower(optional($user)->rol ?? 'cliente');

        $query = PlanoBim::query()
            ->where('eliminado', 0)
            ->with(['proyecto:id,nombre']);

        if ($userRole !== 'admin') {
            $projectIds = $user->projects()->pluck('id');

            if ($projectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $projectIds);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $planos = $query->orderBy('created_at', 'desc')->get();

        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Planos/PlanoIndex', [
            'planos' => $planos->map(function ($plano) {
                $isExternalLink = $plano->tipo === 'URL' && $plano->enlace_externo;
                $downloadUrl = !$isExternalLink && $plano->archivo_url ? route('planos.download', $plano->id) : null;
                $accessUrl = $isExternalLink ? $plano->enlace_externo : $downloadUrl;

                $extension = $plano->archivo_url
                    ? strtoupper(pathinfo($plano->archivo_url, PATHINFO_EXTENSION))
                    : $plano->tipo;

                return [
                    'id' => $plano->id,
                    'titulo' => $plano->nombre,
                    'descripcion' => $plano->descripcion,


                    'archivo_url' => $plano->archivo_url ? asset($plano->archivo_url) : null,


                    'download_url' => !$isExternalLink && $plano->archivo_url
                        ? route('planos.download', $plano->id)
                        : null,

                    'enlace_externo' => $plano->enlace_externo,
                    'tipo' => $plano->tipo,


                    'extension' => strtolower(pathinfo($plano->archivo_url ?? '', PATHINFO_EXTENSION)),

                    'fecha_subida' => $plano->created_at->format('d/m/Y H:i'),
                    'proyecto_id' => $plano->proyecto_id,
                    'proyecto_nombre' => $plano->proyecto->nombre ?? 'N/A',
                ];
            }),
            'projectsList' => $projectsList,
            'userRole' => $userRole,
        ]);
    }


    /**
     * Formulario de creación
     */
    public function create(Request $request)
    {
        if (strtolower(optional($request->user())->rol ?? 'cliente') === 'cliente') {
            return redirect()->route('planos.index')->with('error', 'No tienes permiso para acceder al formulario de subida de planos.');
        }

        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Planos/PlanoCreate', [
            'projectsList' => $projectsList,
        ]);
    }


    /**
     * Almacena un nuevo plano (archivo o enlace) con ruta dinámica.
     */
    public function store(Request $request)
    {
        // 1. Permisos
        if (strtolower(optional($request->user())->rol ?? 'cliente') === 'cliente') {
            return back()->with('error', 'No tienes permiso para crear planos BIM.');
        }

        // 2. Tipos permitidos
        $allowedFileTypes = [
            'PDF',
            'Excel',
            'Word',
            'Imagen',
            'BIM-FBX',
            'BIM-GLB',
            'BIM-GLTF',
            'BIM-IFC',
            'ZIP',
            'Otro',
            'URL'
        ];

        // 3. Validación
        $validated = $request->validate([
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'proyecto_id' => 'required|exists:proyectos,id',
            'archivo' => 'nullable|file|max:512000',
            'enlace_externo' => 'nullable|url|max:500',
            'archivo_tipo' => ['required', Rule::in($allowedFileTypes)],
        ]);

        // 4. Si no hay archivo NI enlace → error
        if (empty($validated['archivo']) && empty($validated['enlace_externo'])) {
            return back()->withErrors([
                'archivo' => 'Debes subir un archivo o ingresar un enlace externo válido.'
            ])->withInput();
        }

        // 🚫 VALIDACIÓN: Solo 1 modelo 3D por proyecto
        $esModelo3D = in_array($validated['archivo_tipo'], [
            'BIM-FBX',
            'BIM-GLB',
            'BIM-GLTF',
            'BIM-IFC'
        ]);


        if ($esModelo3D) {
            $yaExiste = PlanoBim::where('proyecto_id', $validated['proyecto_id'])
                ->whereIn('tipo', ['BIM-FBX', 'BIM-GLB', 'BIM-GLTF', 'BIM-IFC'])
                ->where('eliminado', 0)
                ->count();

            if ($yaExiste >= 1) {
                return back()
                    ->with('error', 'Este proyecto ya tiene un modelo 3D. Solo se permite uno.')
                    ->withInput();
            }
        }

        $tipo = $validated['archivo_tipo'];
        $archivo_url = null;
        $enlace_externo = null;

        // Carpeta dinámica según proyecto
        $project_folder = 'planos/proyecto_' . $validated['proyecto_id'];

        // 5. Subir archivo local
        if ($request->hasFile('archivo')) {

            $file = $request->file('archivo');
            $ext = strtolower($file->getClientOriginalExtension());

            // Nombre temporal original
            $filename = uniqid('plano_') . '.' . $ext;

            // Guardar el archivo original
            $path = $file->storeAs($project_folder, $filename, 'public');

            $absoluteInput = storage_path('app/public/' . $path);

            // Si es FBX → convertir a GLB
            if ($ext === 'fbx') {

                $converter = new FbxConverterService();

                // Nuevo nombre convertivo
                $glbName = uniqid('plano_') . '.glb';
                $glbPath = storage_path('app/public/' . $project_folder . '/' . $glbName);

                $ok = $converter->convertirFbxAGlb($absoluteInput, $glbPath);

                if ($ok) {
                    // Borrar el FBX original
                    Storage::disk('public')->delete($path);

                    // Guardar URL final
                    $archivo_url = '/storage/' . $project_folder . '/' . $glbName;
                    $tipo = 'BIM-GLB';
                } else {
                    return back()->with('error', 'Falló la conversión del modelo FBX a GLB.');
                }
            } else {
                // Cualquier archivo NO FBX
                $archivo_url = '/storage/' . $path;
            }

            $enlace_externo = null;
        } elseif (!empty($validated['enlace_externo'])) {

            // 6. Enlace externo
            $tipo = 'URL';
            $archivo_url = null;
            $enlace_externo = $validated['enlace_externo'];
        }

        // 7. Guardar en BD
        try {

            $planoBim = PlanoBim::create([
                'nombre'        => $validated['titulo'],
                'descripcion'   => $validated['descripcion'] ?? null,
                'proyecto_id'   => $validated['proyecto_id'],
                'archivo_url'   => $archivo_url,
                'enlace_externo' => $enlace_externo,
                'tipo'          => $tipo,
                'subido_por'    => Auth::id(),
            ]);

            AuditoriaLog::create([
                'user_id' => Auth::id(),
                'accion' => "Creó un nuevo plano BIM: {$planoBim->nombre}",
                'tabla_afectada' => 'planos_bim',
                'id_registro_afectado' => $planoBim->id,
                'fecha_accion' => now(),
                'eliminado' => 0,
            ]);

            return redirect()->route('planos.index')
                ->with('success', 'Plano BIM registrado correctamente.');
        } catch (\Exception $e) {

            Log::error('Error al guardar plano BIM: ' . $e->getMessage());

            return back()->with(
                'error',
                'Ocurrió un error al guardar el plano BIM: ' . $e->getMessage()
            )->withInput();
        }
    }



    /**
     * Formulario de edición
     */
    // app/Http/Controllers/PlanoController.php

    public function edit(int $id)
    {
        // Cargar el modelo PlanosBim
        $plano = PlanoBim::findOrFail($id);

        // Permisos de rol
        $userRole = strtolower(optional(request()->user())->rol ?? 'cliente');

        if ($userRole === 'cliente') {
            return redirect()->route('planos.index')->with('error', 'No tienes permiso para editar planos BIM.');
        }

        // Listado de proyectos activos
        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        // El valor que Laravel guarda en la DB es `$plano->tipo`.
        $planoTipo = $plano->tipo ?? 'PDF';

        // 💡 RECOMENDACIÓN: Envía el tipo tal cual está en la DB:
        $planoTipoConsistente = $planoTipo;

        return Inertia::render('Planos/PlanoEdit', [
            'plano' => [
                'id' => $plano->id,
                'titulo' => $plano->nombre ?? '',
                'descripcion' => $plano->descripcion ?? '',
                'proyecto_id' => $plano->proyecto_id,
                'archivo_tipo' => $planoTipoConsistente,
                'enlace_externo' => $plano->enlace_externo ?? '',
                'archivo_url' => $plano->archivo_url ?? '',
            ],
            'projectsList' => $projectsList,
        ]);
    }


    /**
     * Actualiza un plano BIM.
     */
    public function update(Request $request, PlanoBim $plano)
    {
        $userRole = strtolower(optional($request->user())->rol ?? 'cliente');

        if ($userRole === 'cliente') {
            return back()->with('error', 'No tienes permiso para actualizar planos BIM.');
        }

        $validated = $request->validate([
            'titulo' => 'nullable|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'proyecto_id' => 'nullable|exists:proyectos,id',
            'archivo' => 'nullable|file|max:51200|mimes:fbx,glb,gltf,pdf,jpg,jpeg,png,xls,xlsx,doc,docx,zip,ifc',
            'enlace_externo' => 'nullable|url|max:500',
            'archivo_tipo' => ['nullable', Rule::in(['DWG', 'DXF', 'IFC', 'PDF', 'URL', 'Otro', 'ZIP', 'BIM-FBX', 'BIM-GLB', 'BIM-GLTF', 'BIM-IFC'])],
        ]);

        $updateData = [
            'nombre'          => $validated['titulo'] ?? $plano->nombre,
            'descripcion'     => $validated['descripcion'] ?? $plano->descripcion,
            'proyecto_id'     => $validated['proyecto_id'] ?? $plano->proyecto_id,
            'tipo'            => $validated['archivo_tipo'] ?? $plano->tipo,
        ];

        // 🚫 VALIDACIÓN: Solo un modelo 3D por proyecto
        if (isset($validated['archivo_tipo'])) {

            $es3D = in_array($validated['archivo_tipo'], [
                'BIM-FBX',
                'BIM-GLB',
                'BIM-GLTF',
                'BIM-IFC'
            ]);

            if ($es3D) {
                $count = PlanoBim::where('proyecto_id', $plano->proyecto_id)
                    ->whereIn('tipo', ['BIM-FBX', 'BIM-GLB', 'BIM-GLTF', 'BIM-IFC'])
                    ->where('id', '!=', $plano->id)
                    ->where('eliminado', 0)
                    ->count();

                if ($count >= 1) {
                    return back()
                        ->with('error', 'Este proyecto ya tiene un modelo 3D. Solo se permite uno.')
                        ->withInput();
                }
            }
        }

        // Guardar archivo / enlace
        $old_archivo_url = $plano->archivo_url;
        $old_is_local = !empty($old_archivo_url) && $plano->tipo !== 'URL';

        try {
            $new_project_id = $updateData['proyecto_id'];
            $folder = 'planos/proyecto_' . $new_project_id;

            // A) Si hay nuevo archivo
            if ($request->file('archivo')) {

                if ($old_is_local) {
                    $path_delete = str_replace('/storage/', '', $old_archivo_url);
                    if (Storage::disk('public')->exists($path_delete)) {
                        Storage::disk('public')->delete($path_delete);
                    }
                }

                $file = $request->file('archivo');
                $stored = $file->store($folder, 'public');

                $updateData['archivo_url'] = '/storage/' . $stored;
                $updateData['enlace_externo'] = null;
            }
            // B) Si se modificó enlace externo
            elseif (array_key_exists('enlace_externo', $validated)) {

                $new_link = $validated['enlace_externo'];

                if ($old_is_local && !empty($new_link)) {
                    $path_delete = str_replace('/storage/', '', $old_archivo_url);
                    if (Storage::disk('public')->exists($path_delete)) {
                        Storage::disk('public')->delete($path_delete);
                    }
                    $updateData['archivo_url'] = null;
                }

                $updateData['enlace_externo'] = $new_link;

                if (!empty($new_link)) {
                    $updateData['tipo'] = 'URL';
                    $updateData['archivo_url'] = null;
                }
            }

            $plano->update($updateData);

            AuditoriaLog::create([
                'user_id' => Auth::id(),
                'accion' => "Actualizó el plano BIM: {$plano->nombre}",
                'tabla_afectada' => 'planos_bim',
                'id_registro_afectado' => $plano->id,
                'fecha_accion' => now(),
                'eliminado' => 0,
            ]);

            return redirect()->route('planos.index')
                ->with('success', 'Plano BIM actualizado exitosamente.');
        } catch (\Exception $e) {

            Log::error("Error al actualizar plano BIM ID {$plano->id}: " . $e->getMessage());

            return back()->withInput()->with('error', 'Error al actualizar el plano BIM: ' . $e->getMessage());
        }
    }



    /**
     * Descarga de planos autenticada y segura
     */
    public function download(PlanoBim $plano)
    {
        $user = request()->user();
        $userRole = strtolower(optional($user)->rol ?? 'cliente');

        $hasPermission = $userRole === 'admin' ||
            ($plano->proyecto && optional($user)->projects()->pluck('id')->contains($plano->proyecto_id));

        if (!$hasPermission) {
            abort(403, 'No tienes permiso para descargar este plano BIM.');
        }

        if ($plano->tipo === 'URL' && $plano->enlace_externo) {
            //  Auditoría
            AuditoriaLog::create([
                'user_id' => $user->id,
                'accion' => "Accedió al enlace externo del plano BIM: {$plano->nombre}",
                'tabla_afectada' => 'planos_bim',
                'id_registro_afectado' => $plano->id,
                'fecha_accion' => now(),
                'eliminado' => 0,
            ]);

            return redirect()->away($plano->enlace_externo);
        }

        $path = $plano->archivo_url ? str_replace('/storage/', '', $plano->archivo_url) : null;

        if (!$path || !Storage::disk('public')->exists($path)) {
            Log::warning("Archivo no encontrado para el plano BIM ID {$plano->id}: {$plano->archivo_url}");
            abort(404, 'El archivo del plano BIM no fue encontrado en el servidor.');
        }

        try {
            DescargaHistorial::create([
                'user_id' => $user->id,
                'plano_bim_id' => $plano->id,
            ]);

            //  Auditoría
            AuditoriaLog::create([
                'user_id' => $user->id,
                'accion' => "Descargó el plano BIM: {$plano->nombre}",
                'tabla_afectada' => 'planos_bim',
                'id_registro_afectado' => $plano->id,
                'fecha_accion' => now(),
                'eliminado' => 0,
            ]);

            $proyecto = Proyecto::find($plano->proyecto_id);
            if ($proyecto && $proyecto->responsable_id && $user) {
                NotificationService::send(
                    $proyecto->responsable_id,
                    "El usuario {$user->name} ha descargado el plano BIM '{$plano->nombre}' del proyecto '{$proyecto->nombre}'.",
                    'plano_bim',
                    url('/proyectos/' . $proyecto->id),
                    'Plano BIM descargado'
                );
            }
        } catch (\Exception $e) {
            Log::error("Fallo al registrar descarga de plano BIM o enviar notificación: " . $e->getMessage());
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $nombreArchivo = $plano->nombre . '.' . $extension;

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        return $disk->download($path, $nombreArchivo);
    }


    /**
     * Restaura un plano lógicamente eliminado.
     */
    public function restore($id)
    {
        $plano = PlanoBim::where('id', $id)->where('eliminado', 1)->firstOrFail();

        if (strtolower(optional(request()->user())->rol ?? 'cliente') === 'cliente') {
            return back()->with('error', 'No tienes permiso para restaurar planos BIM.');
        }

        $plano->update([
            'eliminado' => 0,
        ]);

        //  Auditoría
        AuditoriaLog::create([
            'user_id' => Auth::id(),
            'accion' => "Restauró el plano BIM: {$plano->nombre}",
            'tabla_afectada' => 'planos_bim',
            'id_registro_afectado' => $plano->id,
            'fecha_accion' => now(),
            'eliminado' => 0,
        ]);

        return back()->with('success', 'Plano BIM restaurado correctamente.');
    }


    /**
     * Muestra los planos BIM marcados como eliminados (papelera).
     */
    public function trash()
    {
        $planos = PlanoBim::where('eliminado', 1)
            ->orderByDesc('created_at')
            ->with('proyecto')
            ->get()
            ->map(function ($plano) {
                $fechaEliminacion = $plano->fecha_eliminacion ?? null;
                $diasRestantes = null;

                if ($fechaEliminacion) {
                    try {
                        $diasRestantes = max(0, 30 - now()->diffInDays($fechaEliminacion));
                        $fechaEliminacion = $fechaEliminacion->format('d/m/Y H:i');
                    } catch (\Exception $e) {
                        $diasRestantes = null;
                        $fechaEliminacion = null;
                    }
                }

                return [
                    'id' => $plano->id,
                    'titulo' => $plano->nombre,
                    'descripcion' => $plano->descripcion,
                    'tipo' => $plano->tipo,
                    'fecha_subida' => $plano->created_at->format('d/m/Y H:i'),
                    'fecha_eliminacion' => $fechaEliminacion,
                    'proyecto_nombre' => $plano->proyecto->nombre ?? 'N/A',
                    'dias_restantes' => $diasRestantes,
                ];
            });

        return Inertia::render('Planos/PlanoTrash', [
            'planos' => $planos,
            'userRole' => strtolower(optional(request()->user())->rol ?? 'cliente'),
        ]);
    }


    /**
     * Elimina (lógicamente) un plano BIM, enviándolo a la papelera.
     */
    public function destroy(PlanoBim $plano)
    {
        if (strtolower(optional(request()->user())->rol ?? 'cliente') === 'cliente') {
            return back()->with('error', 'No tienes permiso para eliminar planos BIM.');
        }

        try {
            $plano->update([
                'eliminado' => 1,
            ]);

            //  Auditoría
            AuditoriaLog::create([
                'user_id' => Auth::id(),
                'accion' => "Eliminó (movió a papelera) el plano BIM: {$plano->nombre}",
                'tabla_afectada' => 'planos_bim',
                'id_registro_afectado' => $plano->id,
                'fecha_accion' => now(),
                'eliminado' => 0,
            ]);

            $proyecto = Proyecto::find($plano->proyecto_id);

            if ($proyecto) {
                $usuariosProyecto = $proyecto->users()->pluck('users.id')->toArray();

                NotificationService::sendToMany(
                    $usuariosProyecto,
                    "El plano BIM '{$plano->nombre}' ha sido enviado a la papelera del proyecto '{$proyecto->nombre}'.",
                    'plano_bim',
                    url('/proyectos/' . $proyecto->id),
                    'Plano BIM eliminado'
                );
            }

            return back()->with('success', 'Plano BIM movido a la papelera.');
        } catch (\Exception $e) {
            Log::error("Error al eliminar plano BIM: " . $e->getMessage());
            return back()->with('error', 'Error al eliminar el plano BIM: ' . $e->getMessage());
        }
    }


    /**
     * Elimina permanentemente un plano BIM individual de la base de datos (Desde papelera).
     */
    public function forceDestroy($id)
    {
        $plano = PlanoBim::where('id', $id)->where('eliminado', 1)->first();

        if (!$plano) {
            return back()->with('error', 'El plano BIM no existe o no está marcado para eliminación.');
        }

        if (strtolower(optional(request()->user())->rol ?? 'cliente') === 'cliente') {
            return back()->with('error', 'No tienes permiso para eliminar planos BIM permanentemente.');
        }

        try {
            if ($plano->archivo_url && $plano->tipo !== 'URL') {
                $path_to_delete = str_replace('/storage/', '', $plano->archivo_url);
                if (Storage::disk('public')->exists($path_to_delete)) {
                    Storage::disk('public')->delete($path_to_delete);
                }
            }

            $plano->delete();

            // Auditoría
            AuditoriaLog::create([
                'user_id' => Auth::id(),
                'accion' => "Eliminó permanentemente el plano BIM: {$plano->nombre}",
                'tabla_afectada' => 'planos_bim',
                'id_registro_afectado' => $plano->id,
                'fecha_accion' => now(),
                'eliminado' => 0,
            ]);

            return back()->with('success', 'Plano BIM eliminado permanentemente.');
        } catch (\Exception $e) {
            Log::error("Error al eliminar permanentemente plano BIM ID {$id}: " . $e->getMessage());
            return back()->with('error', 'Error al intentar eliminar permanentemente el plano BIM: ' . $e->getMessage());
        }
    }
    public function obtenerModelo3D($id)
    {
        try {
            $plano = PlanoBim::find($id);

            if (!$plano) {
                return response()->json([
                    'id' => $id,
                    'titulo' => "Plano {$id}",
                    'tipo' => 'sin_modelo',
                    'url' => null,
                    'error' => 'No existe el plano.'
                ]);
            }

            // Si tiene enlace externo, no es modelo 3D
            if ($plano->tipo === 'URL' && $plano->enlace_externo) {
                return response()->json([
                    'id'     => $id,
                    'titulo' => $plano->nombre,
                    'tipo'   => 'URL',
                    'url'    => $plano->enlace_externo,
                ]);
            }

            // Si no tiene archivo real
            if (!$plano->archivo_url) {
                return response()->json([
                    'id'    => $id,
                    'titulo' => $plano->nombre,
                    'tipo'  => 'placeholder',
                    'url'   => asset('unity-viewer/placeholder/cube.fbx'),
                ]);
            }

            // Convertir ruta
            $url = asset(ltrim($plano->archivo_url, '/'));

            // Extensión exacta
            $ext = strtoupper(pathinfo($plano->archivo_url, PATHINFO_EXTENSION));

            return response()->json([
                'id'     => $id,
                'titulo' => $plano->nombre,
                'tipo'   => $ext,
                'url'    => $url
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error interno: ' . $e->getMessage()
            ]);
        }
    }
}
