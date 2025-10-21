<?php

namespace App\Http\Controllers;

use App\Models\Documento;

use App\Models\Proyecto;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Services\NotificationService;
use App\Models\DescargaHistorial;
use Illuminate\Support\Facades\Log;

class DocController extends Controller
{
    /**
     * Muestra la lista de documentos filtrados por rol y proyectos asociados.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = strtolower($user->rol);

        $query = Documento::query()->where('eliminado', 0)->with(['project:id,nombre']);

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

        return Inertia::render('Docs/DocIndex', [
            'documents' => $documents->map(function ($doc) {
                $downloadUrl = route('docs.download', $doc->id);
                $extension = pathinfo($doc->archivo_url, PATHINFO_EXTENSION);

                return [
                    'id' => $doc->id,
                    'titulo' => $doc->nombre,
                    'descripcion' => $doc->descripcion,
                    'archivo_url' => $downloadUrl,
                    'tipo' => $doc->tipo,
                    'extension' => strtoupper($extension),
                    'fecha_subida' => $doc->created_at->format('d/m/Y H:i'),
                    'proyecto_id' => $doc->proyecto_id,
                    'proyecto_nombre' => $doc->project->nombre ?? 'N/A',
                ];
            }),
            'projectsList' => $projectsList,
            'userRole' => $userRole,
        ]);
    }

    public function create(Request $request)
    {
        if (strtolower($request->user()->rol) === 'cliente') {
            return redirect()->route('docs.index')->with('error', 'No tienes permiso para acceder al formulario de subida.');
        }

        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Docs/DocCreate', [
            'projectsList' => $projectsList,
        ]);
    }
    /**
     * Almacena un nuevo documento y asegura que el usuario esté vinculado al proyecto.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $userRole = strtolower($user->rol);

        if ($userRole === 'cliente') {
            return back()->with('error', 'No tienes permiso para subir documentos.');
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'proyecto_id' => 'required|exists:proyectos,id',
            'archivo' => 'required|file|max:102400',
            'archivo_tipo' => ['required', Rule::in(['PDF', 'Excel', 'Word'])],
        ]);

        $file = $request->file('archivo');
        $fileType = $validated['archivo_tipo'];
        $ruta_archivo_almacenada = null;
        $projectId = $validated['proyecto_id'];

        try {
            $ruta_archivo_almacenada = $file->store('documents');

            if ($userRole !== 'admin') {
                try {
                    $user->projects()->syncWithoutDetaching([
                        $projectId => [
                            'rol_en_proyecto' => $userRole,
                            'eliminado' => 0
                        ]
                    ]);
                } catch (\Exception $e) {
                }
            }
            $documento = Documento::create([
                'proyecto_id' => $projectId,
                'nombre' => $validated['titulo'],
                'descripcion' => $validated['descripcion'],
                'archivo_url' => $ruta_archivo_almacenada,
                'tipo' => $fileType,
                'subido_por' => $user->id,
                'eliminado' => 0,
            ]);

            $projectUsers = Proyecto::find($projectId)
                ->users()
                ->pluck('users.id');

            NotificationService::sendToMany(
                $projectUsers,
                "Se ha subido un nuevo documento al proyecto.",
                'documento'
            );

            return redirect()->route('docs.index')->with('success', 'Documento subido exitosamente.');
        } catch (\Exception $e) {
            if (!empty($ruta_archivo_almacenada)) {
                Storage::delete($ruta_archivo_almacenada);
            }

            return back()->withInput()->with('error', 'Error al subir el archivo o guardar documento: ' . $e->getMessage());
        }
    }

    public function download(Documento $documento)
    {
        $user = request()->user();
        $userRole = strtolower($user->rol);
        $hasPermission = false;

        if ($userRole === 'admin') {
            $hasPermission = true;
        } else {
            $assignedProjectIds = $user->projects->pluck('id');

            if ($assignedProjectIds->contains($documento->proyecto_id)) {
                $hasPermission = true;
            }
        }

        if (!$hasPermission) {
            abort(403, 'No tienes permiso para descargar este documento.');
        }

        if (!Storage::exists($documento->archivo_url)) {
            abort(404, 'El archivo no fue encontrado en el servidor.');
        }

        try {
            DescargaHistorial::create([
                'user_id' => $user->id,
                'documento_id' => $documento->id,
            ]);
        } catch (\Exception $e) {
            Log::error("Fallo al registrar descarga para User ID: {$user->id}, Documento ID: {$documento->id}. Error: " . $e->getMessage());
        }
        
        $extension = pathinfo($documento->archivo_url, PATHINFO_EXTENSION);
        return Storage::download($documento->archivo_url, $documento->nombre . '.' . $extension);
    }

    public function destroy(Documento $documento)
    {
        if (strtolower(request()->user()->rol) === 'cliente') {
            return back()->with('error', 'No tienes permiso para eliminar documentos.');
        }

        try {
            $documento->update(['eliminado' => 1]);

            return back()->with('success', 'Documento eliminado.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el documento: ' . $e->getMessage());
        }
    }
    public function edit(Documento $documento)
    {
        $userRole = strtolower(request()->user()->rol);
        
        if ($userRole === 'cliente') {
            return redirect()->route('docs.index')->with('error', 'No tienes permiso para editar documentos.');
        }

        $projectsList = Proyecto::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);
            
        return Inertia::render('Docs/DocEdit', [
            'document' => [
                'id' => $documento->id,
                'titulo' => $documento->nombre ?? '', 
                'descripcion' => $documento->descripcion ?? '',
                'proyecto_id' => $documento->proyecto_id,
                'tipo' => $documento->tipo ?? '',
            ],
            'projectsList' => $projectsList,
        ]);
    }
    public function update(Request $request, Documento $documento)
{
    $userRole = strtolower($request->user()->rol);

    if ($userRole === 'cliente') {
        return back()->with('error', 'No tienes permiso para actualizar documentos.');
    }

    $validated = $request->validate([
        'titulo' => 'nullable|string|max:150',
        'descripcion' => 'nullable|string|max:1000',
        'proyecto_id' => 'nullable|exists:proyectos,id',
        'archivo' => 'nullable|file|max:102400',
        'archivo_tipo' => ['required_with:archivo', Rule::in(['PDF', 'Excel', 'Word', 'Otro'])],
    ]);
    $updateData['nombre'] = !empty($validated['titulo']) 
        ? $validated['titulo'] 
        : $documento->nombre;

    $updateData['descripcion'] = !empty($validated['descripcion']) 
        ? $validated['descripcion'] 
        : $documento->descripcion;
        
    $updateData['proyecto_id'] = $validated['proyecto_id'] 
        ?? $documento->proyecto_id;
    
    if ($request->file('archivo')) { 
        $file = $request->file('archivo');
        
        try {
            if (!empty($documento->archivo_url) && Storage::exists($documento->archivo_url)) {
                Storage::delete($documento->archivo_url);
            }

            $ruta_archivo_almacenada = $file->store('documents');
            $updateData['archivo_url'] = $ruta_archivo_almacenada;
            $updateData['tipo'] = $validated['archivo_tipo']; 

        } catch (\Exception $e) {
            Log::error("Error al reemplazar archivo para documento ID {$documento->id}: " . $e->getMessage());
            return back()->withInput()->with('error', 'Error al cambiar el archivo: ' . $e->getMessage());
        }
    }
    try {
        $documento->update($updateData);

        NotificationService::sendToMany(
            Proyecto::find($updateData['proyecto_id'])->users()->pluck('users.id'),
            "El documento '{$updateData['nombre']}' ha sido actualizado en el proyecto.",
            'documento'
       );

        return redirect()->route('docs.index')->with('success', 'Documento actualizado exitosamente.');
    } catch (\Exception $e) {
        Log::error("Error al actualizar documento ID {$documento->id}: " . $e->getMessage());
        return back()->withInput()->with('error', 'Error al actualizar el documento: ' . $e->getMessage());
    }
}
}
