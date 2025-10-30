<?php

namespace App\Http\Controllers;

use App\Models\PlanoBIM;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Services\NotificationService;
use App\Models\DescargaHistorial;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;

class PlanoController extends Controller
{
    const MAX_FILE_SIZE_KB = 1048576;
    const BIM_MIMES = 'ifc,rvt,dwg,dxf,obj,fbx,step,iges,stl,dae,3ds,gltf,glb,pdf,zip';
    const BIM_TYPES = ['IFC', 'RVT', 'DWG', 'DXF', 'OBJ', 'FBX', 'STEP', 'IGES', 'STL', 'DAE', '3DS', 'GLTF', 'GLB', 'PDF', 'ZIP', 'RAR', '7Z', 'URL', 'OTRO', 'ARCHIVO'];

    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = strtolower($user->rol);

        $query = PlanoBIM::query()
            ->where('eliminado', 0)
            ->with(['proyecto:id,nombre']);

        if ($userRole !== 'admin') {
            $projectIds = $user->projects->pluck('id');

            if ($projectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $projectIds);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $documents = $query->orderBy('created_at', 'desc')->get();

        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Planos/PlanosIndex', [
            'documents' => $documents->map(function ($doc) {
                $downloadUrl = ($doc->archivo_url && $doc->tipo !== 'URL') ? route('planos.download', $doc->id) : null;

                if ($doc->tipo === 'URL') {
                    $extension = 'URL';
                } else {
                    $pathInfo = pathinfo(str_replace('storage/', '', $doc->archivo_url ?? ''));
                    $extension = strtoupper($pathInfo['extension'] ?? 'N/A');
                }

                return [
                    'id' => $doc->id,
                    'titulo' => $doc->nombre,
                    'descripcion' => $doc->descripcion,
                    'archivo_url' => $downloadUrl,
                    'tipo' => $doc->tipo,
                    'extension' => $extension,
                    'fecha_subida' => $doc->fecha_subida ? $doc->fecha_subida->format('d/m/Y H:i') : null,
                    'proyecto_id' => $doc->proyecto_id,
                    'proyecto_nombre' => $doc->proyecto->nombre ?? 'N/A',
                ];
            }),
            'projectsList' => $projectsList,
            'userRole' => $userRole,
        ]);
    }

    public function create(Request $request)
    {
        // 1. Restricción de Acceso (Adaptado)
        if (strtolower($request->user()->rol) === 'cliente') {
            // Redirige a la ruta de Planos si no tiene permiso
            return redirect()->route('planos.index')->with('error', 'No tienes permiso para acceder al formulario de subida de planos.');
        }

        // 2. Obtener lista de Proyectos
        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        // 3. Renderizar la vista de Planos (Adaptado)
        return Inertia::render('Planos/PlanosCreate', [
            'projectsList' => $projectsList,
            // Importante: Agregar las constantes de límites para que el frontend las use
            'maxFileSize' => self::MAX_FILE_SIZE_KB, 
            'acceptedMimes' => self::BIM_MIMES,
        ]);
    }

    public function store(Request $request)
{
    // 1. Validación de la Solicitud (Se elimina 'archivo_tipo')
    $validated = $request->validate([
        'titulo' => 'required|string|max:150',
        'descripcion' => 'nullable|string|max:1000',
        'proyecto_id' => 'required|exists:proyectos,id',
        'version' => 'nullable|string|max:50', 
        'archivo' => [
            'nullable',
            'file',
            'max:' . self::MAX_FILE_SIZE_KB, 
            'mimes:' . self::BIM_MIMES,
        ],
        // Se mantiene la validación de 'enlace_externo' para capturar la URL
        'enlace_externo' => 'nullable|url|max:500', 
        // ¡'archivo_tipo' ELIMINADO DE LA VALIDACIÓN!
    ], [
        'archivo.max' => 'El tamaño del plano no debe superar 1 GB.',
        'archivo.mimes' => 'El formato del archivo no es un estándar BIM/CAD aceptado (' . str_replace(',', ', ', self::BIM_MIMES) . ').',
        'proyecto_id.required' => 'Debe asociar este plano a un proyecto específico.',
    ]);

    // 2. Inicialización de variables
    // ¡Se elimina la variable $tipo!
    $archivo_data = null;    // Contendrá la ruta de Storage O la URL externa
    $version = $validated['version'] ?? null;
    $subido_por = Auth::id();

    Log::debug('CHECKPOINT 1: Inicio de store. Datos:', ['titulo' => $validated['titulo'], 'proyecto_id' => $validated['proyecto_id']]);

    // 3. Procesamiento y Almacenamiento del Archivo o URL
    if ($request->hasFile('archivo')) {
        try {
            $file = $request->file('archivo');
            
            // Almacenar el archivo
            $path = $file->store('planos/proyecto_' . $validated['proyecto_id'], 'public');
            
            $archivo_data = $path; // Caso 1: Ruta de Storage
            // Se puede usar 'version' para guardar la extensión si no se usa para otra cosa
            // $version = strtoupper($file->getClientOriginalExtension()); 
            Log::debug('CHECKPOINT 2A: Archivo almacenado con éxito.', ['path' => $archivo_data]);
            
        } catch (\Exception $e) {
            Log::error('Error FATAL al guardar el archivo en disco: ' . $e->getMessage(), ['user_id' => $subido_por]);
            return back()->with('error', 'Error de almacenamiento. Verifica permisos o espacio en el servidor.')->withInput();
        }
    } elseif (!empty($validated['enlace_externo'])) {
        // Caso 2: Enlace externo
        $archivo_data = $validated['enlace_externo']; // URL Externa
        // Opcional: Podrías usar 'version' para marcarlo como 'URL'
        // $version = 'URL';
        Log::debug('CHECKPOINT 2B: Procesando URL externa.');
        
    } else {
        return back()->withErrors(['archivo' => 'Debes subir un archivo o ingresar un enlace externo válido.']);
    }

    // 4. Creación del registro en la Base de Datos
    try {
        $dataToCreate = [
            'nombre' => $validated['titulo'],
            'descripcion' => $validated['descripcion'] ?? null,
            'proyecto_id' => $validated['proyecto_id'],
            'archivo_url' => $archivo_data, 
            // ¡'tipo' ELIMINADO de la asignación de datos!
            'version' => $version,
            'subido_por' => $subido_por,
            'fecha_subida' => now(),
            'eliminado' => 0, 
        ];

        Log::debug('CHECKPOINT 3: Intentando crear registro en DB con:', $dataToCreate);
        
        $plano = PlanoBIM::create($dataToCreate); 
        
        Log::debug('CHECKPOINT 4: Registro de PlanoBIM creado. ID:' . $plano->id);

        $proyecto = Proyecto::find($validated['proyecto_id']);

        // 5. Notificación 
        if ($proyecto) {
            $usuariosProyecto = $proyecto->users()->pluck('users.id')->toArray();

            NotificationService::sendToMany(
                $usuariosProyecto,
                "Se ha subido un nuevo plano BIM '{$plano->nombre}' al proyecto '{$proyecto->nombre}'.",
                'plano_bim', 
                route('planos.show', $plano->id),
                'Nuevo Plano BIM'
            );
        }

        // 6. Redirección Exitosa
        Log::debug('CHECKPOINT 5: Finalización exitosa. Redirigiendo.');
        return redirect()->route('planos.index')->with('success', 'Plano BIM registrado y asociado correctamente.'); 

    } catch (\Exception $e) {
        // Manejo de error de base de datos
        Log::error('CHECKPOINT FINAL: Error FATAL al crear el registro del plano BIM en DB: ' . $e->getMessage() . ' Línea: ' . $e->getLine());
        
        // Rollback: Si la DB falló y se subió un archivo, lo eliminamos
        if ($archivo_data && $request->hasFile('archivo')) {
            Storage::disk('public')->delete($archivo_data);
        }

        return back()->with('error', 'Ocurrió un error al guardar el registro en la base de datos. Mensaje: ' . $e->getMessage())->withInput();
    }
}

    public function download(PlanoBIM $plano)
    {
        $user = request()->user();
        $userRole = strtolower($user->rol);

        $hasPermission = $userRole === 'admin' ||
            $user->projects->pluck('id')->contains($plano->proyecto_id);

        if (!$hasPermission) {
            abort(403, 'No tienes permiso para descargar este plano.');
        }

        if ($plano->tipo === 'URL') {
            if ($plano->archivo_url) {
                return redirect()->away($plano->archivo_url);
            }
            abort(404, 'Enlace externo no disponible.');
        }

        $path = $plano->archivo_url;
        if (Str::startsWith($path, 'storage/')) {
            $path = str_replace('storage/', '', $path);
        }

        if (!$plano->archivo_url || !Storage::disk('public')->exists($path)) {
            Log::warning("Archivo de plano BIM no encontrado para el ID {$plano->id}: {$plano->archivo_url}");
            abort(404, 'El archivo de plano no fue encontrado en el servidor.');
        }

        try {
            DescargaHistorial::create([
                'user_id' => $user->id,
                'documento_id' => $plano->id,
            ]);
            $proyecto = Proyecto::find($plano->proyecto_id);
            if ($proyecto && $proyecto->responsable_id) {
                // ... lógica de notificación
            }
        } catch (\Exception $e) {
            Log::error("Fallo al registrar descarga o enviar notificación: " . $e->getMessage());
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $nombreBase = Str::slug($plano->nombre);
        $nombreArchivo = "{$nombreBase}.{$extension}";
        $absolutePath = Storage::disk('public')->path($path); 
        return response()->download($absolutePath, $nombreArchivo);
    }

    public function destroy(PlanoBIM $plano)
    {
        try {
            $plano->update(['eliminado' => 1]);
            return back()->with('success', 'Plano movido a la papelera.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el plano: ' . $e->getMessage());
        }
    }

    public function restore($id)
    {
        $plano = PlanoBIM::where('eliminado', 1)->findOrFail($id);
        $plano->update(['eliminado' => 0]);
        return back()->with('success', 'Plano restaurado correctamente.');
    }

    public function trash()
    {
        $documents = PlanoBIM::where('eliminado', 1)
            ->orderByDesc('fecha_subida')
            ->with('proyecto')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'titulo' => $doc->nombre,
                    'descripcion' => $doc->descripcion,
                    'tipo' => $doc->tipo,
                    'fecha_subida' => $doc->fecha_subida ? $doc->fecha_subida->format('d/m/Y H:i') : null,
                ];
            });

        return Inertia::render('Planos/PlanosTrash', [
            'documents' => $documents,
            'userRole' => strtolower(optional(request()->user())->rol ?? ''),
        ]);
    }

    public function edit(PlanoBIM $plano)
    {
        $userRole = strtolower(request()->user()->rol);

        if ($userRole === 'cliente') {
            return redirect()->route('planos.index')->with('error', 'No tienes permiso para editar planos.');
        }

        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Planos/PlanosEdit', [
            'document' => [
                'id' => $plano->id,
                'titulo' => $plano->nombre,
                'descripcion' => $plano->descripcion,
                'proyecto_id' => $plano->proyecto_id,
                'tipo' => $plano->tipo,
                'version' => $plano->version,
                'archivo_url' => $plano->archivo_url,
            ],
            'projectsList' => $projectsList,
            'maxFileSize' => self::MAX_FILE_SIZE_KB,
            'acceptedMimes' => self::BIM_MIMES,
        ]);
    }

    public function update(Request $request, PlanoBIM $plano)
    {
        $validated = $request->validate([
            'titulo' => 'nullable|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'proyecto_id' => 'nullable|exists:proyectos,id',
            'version' => 'nullable|string|max:50',
            'archivo' => [
                'nullable',
                'file',
                'max:' . self::MAX_FILE_SIZE_KB,
                'mimes:' . self::BIM_MIMES,
            ],
            'enlace_externo' => 'nullable|url|max:500',
            'archivo_tipo' => ['nullable', Rule::in(self::BIM_TYPES)],
        ]);

        $updateData = [
            'nombre' => $validated['titulo'] ?? $plano->nombre,
            'descripcion' => $validated['descripcion'] ?? $plano->descripcion,
            'proyecto_id' => $validated['proyecto_id'] ?? $plano->proyecto_id,
            'version' => $validated['version'] ?? $plano->version,
        ];

        try {
            if ($request->file('archivo')) {
                if ($plano->archivo_url && $plano->tipo !== 'URL') {
                    // Revisa la ruta antes de borrar para evitar errores de almacenamiento
                    $pathToDelete = Str::startsWith($plano->archivo_url, 'storage/') 
                        ? str_replace('storage/', '', $plano->archivo_url) 
                        : $plano->archivo_url;
                    
                    if (Storage::disk('public')->exists($pathToDelete)) {
                        Storage::disk('public')->delete($pathToDelete);
                    }
                }
                
                $file = $request->file('archivo');
                $path = $file->store('planos/proyecto_' . $updateData['proyecto_id'], 'public');

                $updateData['archivo_url'] = $path;
                $updateData['tipo'] = $validated['archivo_tipo'] ?? strtoupper($file->getClientOriginalExtension());
            } elseif (isset($validated['enlace_externo'])) {
                // Si se proporciona un enlace externo, borra el archivo anterior si existía.
                if ($plano->archivo_url && $plano->tipo !== 'URL') {
                    $pathToDelete = Str::startsWith($plano->archivo_url, 'storage/') 
                        ? str_replace('storage/', '', $plano->archivo_url) 
                        : $plano->archivo_url;
                    
                    if (Storage::disk('public')->exists($pathToDelete)) {
                        Storage::disk('public')->delete($pathToDelete);
                    }
                }

                $updateData['archivo_url'] = $validated['enlace_externo'];
                $updateData['tipo'] = 'URL';
            } elseif (isset($validated['archivo_tipo']) && $validated['archivo_tipo'] !== $plano->tipo) {
                 $updateData['tipo'] = $validated['archivo_tipo'];
            }

            $plano->update($updateData);


            return redirect()->route('planos.index')->with('success', 'Plano actualizado exitosamente.');
        } catch (\Exception $e) {
            Log::error("Error al actualizar plano ID {$plano->id}: " . $e->getMessage());
            return back()->withInput()->with('error', 'Error al actualizar el plano: ' . $e->getMessage());
        }
    }
}
