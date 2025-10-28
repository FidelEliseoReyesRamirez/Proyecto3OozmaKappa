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
use Illuminate\Support\Facades\Auth;

class DocController extends Controller
{
    /**
     * Muestra la lista de documentos filtrados por rol y proyectos asociados.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = strtolower($user->rol);

        $query = Documento::query()
            ->where('eliminado', 0)
            ->with(['project:id,nombre']);

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
                $downloadUrl = $doc->archivo_url ? route('docs.download', $doc->id) : null;
                $extension = $doc->archivo_url ? strtoupper(pathinfo($doc->archivo_url, PATHINFO_EXTENSION)) : 'URL';

                return [
                    'id' => $doc->id,
                    'titulo' => $doc->nombre,
                    'descripcion' => $doc->descripcion,
                    'archivo_url' => $downloadUrl,
                    'enlace_externo' => $doc->enlace_externo,
                    'tipo' => $doc->tipo,
                    'extension' => $extension,
                    'fecha_subida' => $doc->created_at->format('d/m/Y H:i'),
                    'proyecto_id' => $doc->proyecto_id,
                    'proyecto_nombre' => $doc->project->nombre ?? 'N/A',
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
     * Almacena un nuevo documento (archivo o enlace).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:1000',
            'proyecto_id' => 'required|exists:proyectos,id',
            'archivo' => 'nullable|file|max:51200',
            'enlace_externo' => 'nullable|url|max:500',
            'archivo_tipo' => 'required|in:PDF,Excel,Word,URL',
        ]);

        $tipo = $validated['archivo_tipo'];
        $archivo_url = null;

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $path = $file->store('documentos', 'public');
            $archivo_url = '/storage/' . $path;
        } elseif (!empty($validated['enlace_externo'])) {
            $tipo = 'URL';
            $archivo_url = $validated['enlace_externo'];
        } else {
            return back()->withErrors([
                'archivo' => 'Debes subir un archivo o ingresar un enlace externo válido (Drive, OneDrive, etc.).'
            ]);
        }

        try {
            $documento = Documento::create([
                'nombre' => $validated['titulo'],
                'descripcion' => $validated['descripcion'] ?? null,
                'proyecto_id' => $validated['proyecto_id'],
                'archivo_url' => $archivo_url,
                'tipo' => $tipo,
                'subido_por' => Auth::id(),
            ]);

            $proyecto = Proyecto::find($validated['proyecto_id']);

            if ($proyecto) {
                $usuariosProyecto = $proyecto->users()->pluck('users.id')->toArray();

                NotificationService::sendToMany(
                    $usuariosProyecto,
                    "Se ha subido un nuevo documento '{$documento->nombre}' al proyecto '{$proyecto->nombre}'.",
                    'documento',
                    url('/proyectos/' . (string)$proyecto->id),
                    'Nuevo documento'
                );
            }

            return redirect()->route('docs.index')->with('success', 'Documento registrado correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al guardar documento: ' . $e->getMessage());
            return back()->with('error', 'Ocurrió un error al guardar el documento.')->withInput();
        }
    }

    /**
     * Descarga de documentos autenticada y segura
     */
    public function download(Documento $documento)
    {
        $user = request()->user();
        $userRole = strtolower($user->rol);

        // 1. Verificar permisos
        $hasPermission = $userRole === 'admin' ||
            $user->projects->pluck('id')->contains($documento->proyecto_id);

        if (!$hasPermission) {
            abort(403, 'No tienes permiso para descargar este documento.');
        }

        // 2. Si es un enlace externo
        if ($documento->tipo === 'URL') {
            return redirect()->away($documento->archivo_url);
        }

        // 3. Asegurar ruta correcta
        $path = str_replace('/storage/', '', $documento->archivo_url);

        // 4. Verificar existencia del archivo
        if (!$documento->archivo_url || !Storage::disk('public')->exists($path)) {
            Log::warning("Archivo no encontrado para el documento ID {$documento->id}: {$documento->archivo_url}");
            abort(404, 'El archivo no fue encontrado en el servidor.');
        }

        // 5. Registrar la descarga (sin romper si falla)
        try {
            DescargaHistorial::create([
                'user_id' => $user->id,
                'documento_id' => $documento->id,
            ]);

            $proyecto = Proyecto::find($documento->proyecto_id);
            if ($proyecto && $proyecto->responsable_id) {
                NotificationService::send(
                    $proyecto->responsable_id,
                    "El usuario {$user->name} ha descargado el documento '{$documento->nombre}' del proyecto '{$proyecto->nombre}'.",
                    'documento',
                    url('/proyectos/' . $proyecto->id),
                    'Documento descargado'
                );
            }
        } catch (\Exception $e) {
            Log::error("Fallo al registrar descarga o enviar notificación: " . $e->getMessage());
        }

        // 6. Preparar nombre de descarga
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $nombreArchivo = $documento->nombre . '.' . $extension;

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        return $disk->download($path, $nombreArchivo);
    }

    public function restore($id)
    {
        $documento = Documento::findOrFail($id);

        if (strtolower(request()->user()->rol) === 'cliente') {
            return back()->with('error', 'No tienes permiso para restaurar documentos.');
        }

        $documento->update([
            'eliminado' => 0,
            'fecha_eliminacion' => null
        ]);

        return back()->with('success', 'Documento restaurado correctamente.');
    }

    public function trash()
    {
        $documents = Documento::where('eliminado', 1)
            ->orderByDesc('fecha_eliminacion')
            ->with('project')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'titulo' => $doc->nombre,
                    'descripcion' => $doc->descripcion,
                    'tipo' => $doc->tipo,
                    'fecha_subida' => $doc->created_at->format('d/m/Y H:i'),
                    'fecha_eliminacion' => $doc->fecha_eliminacion
                        ? $doc->fecha_eliminacion->format('d/m/Y H:i')
                        : null,
                    'proyecto_nombre' => $doc->project->nombre ?? 'N/A',
                    'dias_restantes' => $doc->fecha_eliminacion
                        ? max(0, 30 - now()->diffInDays($doc->fecha_eliminacion))
                        : null,
                ];
            });

        return Inertia::render('Docs/DocTrash', [
            'documents' => $documents,
            'userRole' => strtolower(optional(request()->user())->rol ?? ''),
        ]);
    }

    /**
     * Elimina (lógicamente) un documento
     */
    public function destroy(Documento $documento)
    {
        if (strtolower(request()->user()->rol) === 'cliente') {
            return back()->with('error', 'No tienes permiso para eliminar documentos.');
        }

        try {
            $documento->update([
                'eliminado' => 1,
                'fecha_eliminacion' => now(),
            ]);

            $proyecto = Proyecto::find($documento->proyecto_id);
            $usuariosProyecto = $proyecto->users()->pluck('users.id')->toArray();

            NotificationService::sendToMany(
                $usuariosProyecto,
                "El documento '{$documento->nombre}' ha sido enviado a la papelera del proyecto '{$proyecto->nombre}'.",
                'documento',
                url('/proyectos/' . $proyecto->id),
                'Documento eliminado'
            );

            return back()->with('success', 'Documento movido a la papelera.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el documento: ' . $e->getMessage());
        }
    }

    /**
     * Formulario de edición
     */
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
                'enlace_externo' => $documento->enlace_externo ?? '',
            ],
            'projectsList' => $projectsList,
        ]);
    }

    /**
     * Actualiza documento
     */
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
            'archivo' => 'nullable|file|max:51200',
            'enlace_externo' => 'nullable|url|max:500',
            'archivo_tipo' => ['nullable', Rule::in(['PDF', 'Excel', 'Word', 'Otro'])],
        ]);

        $updateData = [
            'nombre' => $validated['titulo'] ?? $documento->nombre,
            'descripcion' => $validated['descripcion'] ?? $documento->descripcion,
            'proyecto_id' => $validated['proyecto_id'] ?? $documento->proyecto_id,
            'enlace_externo' => $validated['enlace_externo'] ?? $documento->enlace_externo,
        ];

        try {
            if ($request->file('archivo')) {
                $file = $request->file('archivo');

                if (!empty($documento->archivo_url) && Storage::exists($documento->archivo_url)) {
                    Storage::delete($documento->archivo_url);
                }

                $ruta_archivo_almacenada = $file->store('documents');
                $updateData['archivo_url'] = $ruta_archivo_almacenada;
                $updateData['tipo'] = $validated['archivo_tipo'] ?? $documento->tipo;
            }

            $documento->update($updateData);

            $proyecto = Proyecto::find($updateData['proyecto_id']);
            $usuariosProyecto = $proyecto->users()->pluck('users.id')->toArray();

            NotificationService::sendToMany(
                $usuariosProyecto,
                "El documento '{$updateData['nombre']}' ha sido actualizado en el proyecto '{$proyecto->nombre}'.",
                'documento',
                url('/proyectos/' . $proyecto->id),
                'Documento actualizado'
            );

            return redirect()->route('docs.index')->with('success', 'Documento actualizado exitosamente.');
        } catch (\Exception $e) {
            Log::error("Error al actualizar documento ID {$documento->id}: " . $e->getMessage());
            return back()->withInput()->with('error', 'Error al actualizar el documento: ' . $e->getMessage());
        }
    }
}
