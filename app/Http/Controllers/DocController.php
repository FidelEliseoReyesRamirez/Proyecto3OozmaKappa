<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class DocController extends Controller
{
    /**
     * Muestra la lista de documentos filtrados por rol y proyecto.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = $user->rol;
        
        $query = Documento::query()
            ->where('eliminado', 0)
            ->with(['project:id,nombre']); 
            
        
        if ($userRole === 'cliente') {
            $clientProjectIds = $user->projects()->pluck('id');

            if ($clientProjectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $clientProjectIds);
            } else {
                $query->whereRaw('1 = 0'); 
            }

        } elseif (in_array($userRole, ['arquitecto', 'ingeniero'])) {
            $assignedProjectIds = $user->projects()->pluck('id');
            
            if ($assignedProjectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $assignedProjectIds);
            } else {
                $query->whereRaw('1 = 0'); 
            }
        } 
        
        $documents = $query->orderBy('created_at', 'desc')->get();
        
        $projectsList = Project::where('eliminado', 0)
                               ->get(['id', 'nombre'])
                               ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Docs/DocIndex', [
            'documents' => $documents->map(function ($doc) use ($userRole) {
                $downloadUrl = route('docs.download', $doc->id);
                
                $extension = pathinfo($doc->archivo_url, PATHINFO_EXTENSION);
                
                return [
                    'id' => $doc->id,
                    'titulo' => $doc->nombre, 
                    'descripcion' => $doc->descripcion,
                    'archivo_url' => $downloadUrl,
                    'tipo' => $doc->tipo, 
                    'extension' => strtoupper($extension),
                    'fecha_subida' => $doc->fecha_subida->format('d/m/Y H:i'),
                    'proyecto_id' => $doc->proyecto_id,
                    'proyecto_nombre' => $doc->project->nombre ?? 'N/A',
                ];
            }),
            'projectsList' => $projectsList,
            'userRole' => $userRole, 
        ]);
    }

    /**
     * Muestra el formulario para subir un nuevo documento (para Inertia).
     */
    public function create(Request $request)
    {
        if ($request->user()->rol === 'cliente') {
            return redirect()->route('docs.index')->with('error', 'No tienes permiso para acceder al formulario de subida.');
        }

        $projectsList = Project::where('eliminado', 0)
                               ->get(['id', 'nombre'])
                               ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Docs/DocCreate', [
            'projectsList' => $projectsList,
        ]);
    }
    /**
     * Almacena un nuevo documento, incluyendo la subida del archivo.
     */
    public function store(Request $request)
    {
        if ($request->user()->rol === 'cliente') {
            return back()->with('error', 'No tienes permiso para subir documentos.');
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'proyecto_id' => 'required|exists:proyectos,id',
            'archivo' => 'required|file|max:10240', 
            'archivo_tipo' => ['required', Rule::in(['PDF', 'Excel', 'Word'])],
        ]);
        
        $file = $request->file('archivo');
        $fileType = $validated['archivo_tipo'];
        
        $extensionMap = [
            'PDF' => 'pdf',
            'Excel' => 'xlsx',
            'Word' => 'docx',
        ];

        $extension = $extensionMap[$fileType] ?? 'bin';
        
        try {
            $ruta_archivo_almacenada = $file->store('documents'); 
            
            $mimeType = $file->getClientMimeType();
            Documento::create([
                'proyecto_id' => $validated['proyecto_id'],
                'nombre' => $validated['titulo'],
                'descripcion' => $validated['descripcion'],
                'archivo_url' => $ruta_archivo_almacenada, 
                'tipo' => $fileType, 
                'subido_por' => $request->user()->id,
                'eliminado' => 0,
            ]);

            return redirect()->route('docs.index')->with('success', 'Documento subido exitosamente.');

        } catch (\Exception $e) {
            if (isset($ruta_archivo_almacenada)) {
                 Storage::delete($ruta_archivo_almacenada);
            }
            return back()->withInput()->with('error', 'Error al subir el archivo: ' . $e->getMessage());
        }
    }
    /**
     * Permite la descarga segura de un documento, verificando permisos.
     */
    public function download(Request $request, Documento $documento)
    {
        $user = $request->user();
        $userRole = $user->rol;
        $hasPermission = false;
        
        if ($userRole === 'cliente') {
            $clientProjectIds = $user->projects()->pluck('id');
            if ($clientProjectIds->contains($documento->proyecto_id)) {
                $hasPermission = true;
            }
        } elseif (in_array($userRole, ['arquitecto', 'ingeniero'])) {
            $assignedProjectIds = $user->projects()->pluck('id');
            if ($assignedProjectIds->contains($documento->proyecto_id)) {
                $hasPermission = true;
            }
        } elseif ($userRole === 'administrador') {
            $hasPermission = true;
        }

        if (!$hasPermission) {
            return response()->json(['error' => 'Acceso denegado. No tiene permisos para descargar este documento.'], 403);
        }
        
        $filePath = $documento->archivo_url;

        if (Storage::exists($filePath)) {
            return Storage::download($filePath, $documento->nombre . '.' . pathinfo($filePath, PATHINFO_EXTENSION));
        }

        return response()->json(['error' => 'Archivo no encontrado en el servidor.'], 404);
    }
    /**
     * Elimina lógicamente un documento. (Solo para usuarios internos)
     */
    public function destroy(Documento $documento)
    {
        if (request()->user()->rol === 'cliente') {
            return back()->with('error', 'No tienes permiso para eliminar documentos.');
        }

        try {
            $documento->update(['eliminado' => 1]);
            
            return back()->with('success', 'Documento eliminado.');

        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el documento: ' . $e->getMessage());
        }
    }
}