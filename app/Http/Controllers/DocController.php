<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Services\NotificationService;

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

        // Aplicar restricción de visibilidad si el usuario NO es 'admin'
        if ($userRole !== 'admin') {

            // CRUCIAL: Obtener los IDs de proyecto a los que el usuario está asociado (excluyendo eliminados).
            $projectIds = $user->projects->pluck('id');

            if ($projectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $projectIds);
            } else {
                // Si no tiene proyectos asignados, asegura que no vea ningún documento.
                $query->whereRaw('1 = 0');
            }
        }

        $documents = $query->orderBy('created_at', 'desc')->get();

        // Lista completa de proyectos (para filtros o el formulario de subida)
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

    // -------------------------------------------------------------------------

    public function create(Request $request)
    {
        if (strtolower($request->user()->rol) === 'cliente') {
            return redirect()->route('docs.index')->with('error', 'No tienes permiso para acceder al formulario de subida.');
        }

        $projectsList = Project::where('eliminado', 0)
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);

        return Inertia::render('Docs/DocCreate', [
            'projectsList' => $projectsList,
        ]);
    }

    // -------------------------------------------------------------------------

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
            'archivo' => 'required|file|max:10240',
            'archivo_tipo' => ['required', Rule::in(['PDF', 'Excel', 'Word'])],
        ]);

        $file = $request->file('archivo');
        $fileType = $validated['archivo_tipo'];
        $ruta_archivo_almacenada = null;
        $projectId = $validated['proyecto_id'];

        try {
            // 1. Guardar el archivo
            $ruta_archivo_almacenada = $file->store('documents');

            // 2. Asegurar que el usuario esté vinculado al proyecto (si no es admin)
            if ($userRole !== 'admin') {
                try {
                    $user->projects()->syncWithoutDetaching([
                        $projectId => [
                            'rol_en_proyecto' => $userRole,
                            'eliminado' => 0
                        ]
                    ]);
                } catch (\Exception $e) {
                    // ignoramos si ya estaba vinculado
                }
            }

            // 3. Crear el documento
            $documento = Documento::create([
                'proyecto_id' => $projectId,
                'nombre' => $validated['titulo'],
                'descripcion' => $validated['descripcion'],
                'archivo_url' => $ruta_archivo_almacenada,
                'tipo' => $fileType,
                'subido_por' => $user->id,
                'eliminado' => 0,
            ]);

            // 4. Obtener TODOS los usuarios del proyecto (no solo el usuario actual)
            // Asegúrate que en tu modelo Proyecto existe la relación users()
            $projectUsers = \App\Models\Proyecto::find($projectId)
                ->users()
                ->pluck('users.id');

            // (Opcional) excluir al usuario que subió el documento
            // $projectUsers = $projectUsers->reject(fn($id) => $id == $user->id);

            // 5. Enviar notificaciones
            NotificationService::sendToMany(
                $projectUsers,
                "Se ha subido un nuevo documento al proyecto.",
                'documento'
            );

            return redirect()->route('docs.index')->with('success', 'Documento subido exitosamente.');
        } catch (\Exception $e) {
            // Manejo de errores
            if (!empty($ruta_archivo_almacenada)) {
                Storage::delete($ruta_archivo_almacenada);
            }

            return back()->withInput()->with('error', 'Error al subir el archivo o guardar documento: ' . $e->getMessage());
        }
    }



    // -------------------------------------------------------------------------

    public function download(Documento $documento)
    {
        $user = request()->user();
        $userRole = strtolower($user->rol);
        $hasPermission = false;

        // 1. Si el rol es 'admin', siempre tiene permiso.
        if ($userRole === 'admin') {
            $hasPermission = true;
        } else {
            // 2. Para otros roles, verifica la asociación al proyecto.
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

        $extension = pathinfo($documento->archivo_url, PATHINFO_EXTENSION);
        return Storage::download($documento->archivo_url, $documento->nombre . '.' . $extension);
    }

    // -------------------------------------------------------------------------

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
}
