<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class DocController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = strtolower($user->rol);

        $query = Documento::query()->where('eliminado', 0)->with(['project:id,nombre']);

        // Filtrar según rol y proyectos asociados
        if ($userRole === 'cliente' || in_array($userRole, ['arquitecto', 'ingeniero'])) {
            $projectIds = $user->projects()->pluck('proyectos.id'); // especificar tabla
            if ($projectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $projectIds);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $documents = $query->orderBy('created_at', 'desc')->get();

        $projectsList = Project::where('eliminado', 0)
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
        if ($request->user()->rol === 'cliente') {
            return redirect()->route('docs.index')
                ->with('error', 'No tienes permiso para acceder al formulario de subida.');
        }

        $projectsList = Project::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Docs/DocCreate', [
            'projectsList' => $projectsList,
        ]);
    }

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

        try {
            // Guardar en storage/app/documents
            $ruta_archivo_almacenada = $file->store('documents');

            Documento::create([
                'proyecto_id'   => $validated['proyecto_id'],
                'nombre'        => $validated['titulo'],
                'descripcion'   => $validated['descripcion'] ?? null,
                'archivo_url'   => $ruta_archivo_almacenada,
                'tipo'          => $fileType,
                'fecha_subida'  => now(),
                'subido_por'    => $request->user()->id,
                'eliminado'     => 0,
            ]);

            return redirect()->route('docs.index')
                ->with('success', 'Documento subido exitosamente.');
        } catch (\Exception $e) {
            if (!empty($ruta_archivo_almacenada)) {
                Storage::delete($ruta_archivo_almacenada);
            }
            return back()->withInput()->with('error', 'Error al subir el archivo: ' . $e->getMessage());
        }
    }

    public function download(Documento $documento)
    {
        $user = request()->user();
        $userRole = strtolower($user->rol);
        $hasPermission = false;

        if ($userRole === 'admin') {
            $hasPermission = true;
        } elseif (in_array($userRole, ['arquitecto', 'ingeniero'])) {
            $assignedProjectIds = $user->projects()->pluck('proyectos.id');
            if ($assignedProjectIds->contains($documento->proyecto_id)) {
                $hasPermission = true;
            }
        } elseif ($userRole === 'cliente') {
            $clientProjectIds = $user->projects()->pluck('proyectos.id');
            if ($clientProjectIds->contains($documento->proyecto_id)) {
                $hasPermission = true;
            }
        }

        if (!$hasPermission) {
            abort(403, 'No tienes permiso para descargar este documento.');
        }

        if (!Storage::exists($documento->archivo_url)) {
            abort(404, 'El archivo no fue encontrado en el servidor.');
        }

        $extension = pathinfo($documento->archivo_url, PATHINFO_EXTENSION);
        return Storage::download($documento->archivo_url, $documento->nombre . '.' . $extension);
    }

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
