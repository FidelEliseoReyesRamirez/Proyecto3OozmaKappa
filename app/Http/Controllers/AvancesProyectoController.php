<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use App\Models\Hitos;
use App\Models\Documento;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf as PDF_Facade; 

class AvancesProyectoController extends Controller
{
    /**
     * Muestra la vista de la línea de tiempo de un proyecto específico, con datos dinámicos.
     */
    public function showTimeline($projectId)
    {
        $user = Auth::user();

        $project = Proyecto::with([
            'responsable:id,name', 
            'cliente:id,name',
            'hitos' => function ($query) {
                $query->with(['encargado:id,name', 'documento:id,nombre'])
                    ->orderBy('fecha_hito');
            },
            'documentos:id,proyecto_id,nombre,created_at,descripcion' 
        ])
        ->where('cliente_id', $user->id) 
        ->findOrFail($projectId);

        $fixedMilestones = [
            [
                'title' => 'Inicio del Proyecto',
                'date' => (string) $project->fecha_inicio,
                'type' => 'start',
                'description' => $project->descripcion ?? '', 
                'status' => 'Completado',
                'encargado' => $project->responsable ? $project->responsable->name : 'N/A',
                'documento' => null,
            ],
            [
                'title' => 'Entrega Final del Proyecto',
                'date' => (string) $project->fecha_fin,
                'type' => 'delivery',
                'description' => $project->descripcion ?? '', 
                'status' => strtolower($project->estado) === 'finalizado' ? 'Completado' : 'Pendiente',
                'encargado' => $project->responsable ? $project->responsable->name : 'N/A',
                'documento' => null,
            ],
        ];

        $dynamicMilestones = $project->hitos->map(function ($hito) {
            return [
                'title' => $hito->nombre,
                'date' => (string) $hito->fecha_hito,
                'type' => 'milestone',
                'description' => $hito->descripcion, 
                'status' => $hito->estado,
                'encargado' => $hito->encargado ? $hito->encargado->name : 'Sin asignar',
                'documento' => $hito->documento ? [
                    'id' => $hito->documento->id,
                    'name' => $hito->documento->nombre,
                ] : null,
            ];
        })->toArray();

        $documentMilestones = $project->documentos->map(function ($doc) {
            
            return [
                'title' => 'Documento Subido: ' . $doc->nombre,
                'date' => (string) $doc->created_at, 
                'type' => 'milestone', 
                'description' => $doc->descripcion,
                'status' => 'Completado',
                'encargado' => 'Sistema', 
                'documento' => [
                    'id' => $doc->id,
                    'name' => $doc->nombre,
                ],
            ];
        })->toArray();

        $milestones = array_merge($fixedMilestones, $dynamicMilestones, $documentMilestones);
        $clientProjects = Proyecto::where('cliente_id', $user->id)
                                 ->select('id', 'nombre', 'estado')
                                 ->get();

        return Inertia::render('UserProyectos/Timeline', [
            'clientProjects' => $clientProjects,
            'project' => [
                'id' => $project->id,
                'name' => $project->nombre,
                'status' => $project->estado ?? 'En Progreso',
            ],
            'milestones' => $milestones,
        ]);
    }
    
    /**
     * Redirige al primer proyecto asignado al cliente autenticado.
     */
    public function showClientTimeline()
    {
        $user = Auth::user();

        if (!$user || $user->rol !== 'cliente') {
            abort(403, 'Acceso no autorizado.');
        }

        $project = Proyecto::where('cliente_id', $user->id)
                            ->orderBy('id')
                            ->first();

        if (!$project) {
             return Inertia::render('UserProyectos/NoProject', [
                 'message' => 'Actualmente no tienes proyectos asignados como cliente.'
             ]);
        }
        
        return $this->showTimeline($project->id);
    }

    /**
     * Este método solo se actualizaría si se llama desde el backend.
     */
    public function updateStatus($id)
    {
        $proyecto = Proyecto::findOrFail($id);

        $todosFinalizados = $proyecto->hitos()
            ->whereNotIn('estado', ['finalizado', 'completado'])
            ->doesntExist();

        if ($todosFinalizados) {
            $proyecto->estado = 'Finalizado';
            $proyecto->save();
        }

        return redirect()->back()->with('success', 'Estado del proyecto actualizado correctamente.');
    }

    /**
     * Genera y descarga el reporte PDF del historial de estados del proyecto.
     */
    public function downloadReport($projectId)
    {
        $user = Auth::user();
        $project = Proyecto::with([
            'responsable:id,name', 
            'cliente:id,name',
            'hitos' => function ($query) {
                $query->with('encargado:id,name')->orderBy('fecha_hito', 'asc');
            },
            'documentos:id,proyecto_id,nombre,created_at,descripcion' 
        ])
        ->where('cliente_id', $user->id) 
        ->findOrFail($projectId);
        $fixedHistorial = collect([
            [
                'fecha' => Carbon::parse($project->fecha_inicio)->format('d/m/Y'),
                'evento' => 'Inicio del Proyecto',
                'descripcion' => $project->descripcion ?? 'El proyecto ha sido iniciado.',
                'estado' => 'Completado',
                'encargado' => $project->responsable->name ?? 'N/A',
            ],
            [
                'fecha' => Carbon::parse($project->fecha_fin)->format('d/m/Y'),
                'evento' => 'Entrega Final del Proyecto',
                'descripcion' => $project->descripcion ?? 'Entrega final y cierre del proyecto.',
                'estado' => strtolower($project->estado) === 'finalizado' ? 'Completado' : 'Pendiente',
                'encargado' => $project->responsable->name ?? 'N/A',
            ],
        ]);
        
        $dynamicHistorial = $project->hitos->map(function ($hito) {
            return [
                'fecha' => Carbon::parse($hito->fecha_hito)->format('d/m/Y'), 
                'evento' => $hito->nombre,
                'descripcion' => $hito->descripcion,
                'estado' => $hito->estado,
                'encargado' => $hito->encargado->name ?? 'N/A',
            ];
        });
        $documentHistorial = $project->documentos->map(function ($doc) {
            return [
                'fecha' => Carbon::parse($doc->created_at)->format('d/m/Y'), 
                'evento' => 'Documento Subido: ' . $doc->nombre,
                'descripcion' => $doc->descripcion ?? 'Documento subido al sistema.',
                'estado' => 'Completado',
                'encargado' => 'Sistema', 
            ];
        });
        $historial = $fixedHistorial
                        ->merge($dynamicHistorial)
                        ->merge($documentHistorial)
                        ->sortBy(function($item) {
                            return Carbon::createFromFormat('d/m/Y', $item['fecha']);
                        })
                        ->values(); 
        $data = [
            'project' => $project,
            'historial' => $historial, 
            'reporte_fecha' => now()->format('d/m/Y H:i:s'),
        ];
        
        $pdf = PDF_Facade::loadView('pdf.project_report', $data);

        return $pdf->download('Reporte_Proyecto_' . $project->id . '_' . now()->format('Ymd') . '.pdf');
    }
}