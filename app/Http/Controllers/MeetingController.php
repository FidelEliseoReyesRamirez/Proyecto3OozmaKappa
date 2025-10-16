<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use App\Services\NotificationService;

class MeetingController extends Controller
{
    /**
     * Muestra el calendario con las reuniones.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = $user->rol;

        $query = Meeting::query()
            ->where('eliminado', 0)
            ->with(['project:id,nombre', 'users:id,name,apellido']);

        if ($userRole === 'cliente') {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } elseif (in_array($userRole, ['arquitecto', 'ingeniero'])) {
            $assignedProjectIds = $user->projects->pluck('id');

            if ($assignedProjectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $assignedProjectIds);
            } else {
                $query->whereHas('users', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            }
        }

        $meetings = $query->get();

        $formattedMeetings = $meetings->map(function ($meeting) {

            $start_time = $meeting->fecha_hora;

            if (is_null($start_time)) {
                return null;
            }

            $end_time = $start_time->copy()->addHour();

            return [
                'id' => $meeting->id,
                'title' => $meeting->titulo,
                'start' => $start_time->toDateTimeString(),
                'end' => $end_time->toDateTimeString(),
                'description' => $meeting->descripcion,
                'projectId' => $meeting->proyecto_id,
                'projectTitle' => $meeting->project->nombre ?? 'Proyecto Eliminado',
                'participants' => $meeting->users->pluck('id')->toArray(),
            ];
        })->filter()->values();

        $usersList = User::where('eliminado', 0)->get(['id', 'name', 'apellido'])->map(function ($u) {
            return ['id' => $u->id, 'name' => "{$u->name} {$u->apellido}"];
        });

        $projectsList = Proyecto::where('eliminado', 0)
            ->where('estado', '!=', 'finalizado')
            ->get(['id', 'nombre'])
            ->map(fn($p) => ['id' => $p->id, 'name' => $p->nombre]);


        return Inertia::render('Calendar/CalendarIndex', [
            'meetings' => $formattedMeetings,
            'usersList' => $usersList,
            'projectsList' => $projectsList,
        ]);
    }

    /**
     * Almacena una nueva reunión en la base de datos.
     */
    public function store(Request $request)
    {
        if ($request->user()->rol === 'cliente') {
            return Redirect::back()->with('error', 'No tienes permiso para crear reuniones.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'nullable|string|max:1000',
            'start' => 'required|date|after_or_equal:now',
            'end' => 'required|date|after:start',
            'projectId' => 'required|exists:proyectos,id',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id',
        ]);

        $fecha_inicio = new \DateTime($validated['start']);
        $fecha_fin = new \DateTime($validated['end']);
        $participantIds = $validated['participants'];

        $overlappingMeetingIds = Meeting::where('eliminado', 0)
            ->where(function ($query) use ($fecha_inicio, $fecha_fin) {

                $start_col = 'fecha_hora';
                $end_col_existing = DB::raw('DATE_ADD(fecha_hora, INTERVAL 1 HOUR)');

                $query->where($start_col, '<', $fecha_fin)
                    ->where($end_col_existing, '>', $fecha_inicio);
            })->pluck('id');


        if ($overlappingMeetingIds->isNotEmpty()) {
            $conflictingUsers = User::whereIn('id', $participantIds)
                ->whereHas('usersMeetings', function ($query) use ($overlappingMeetingIds) {
                    $query->whereIn('reuniones.id', $overlappingMeetingIds);
                })
                ->get(['name', 'apellido']);

            if ($conflictingUsers->isNotEmpty()) {
                $names = $conflictingUsers->pluck('name')->implode(', ');

                return redirect()->back()->withErrors([
                    'time_conflict' => "Conflicto de horario. Los siguientes participantes ya tienen una reunión agendada: {$names}.",
                ])->withInput();
            }
        }
        DB::beginTransaction();
        try {
            $meeting = Meeting::create([
                'proyecto_id' => $validated['projectId'],
                'titulo' => $validated['title'],
                'descripcion' => $validated['description'],
                'fecha_hora' => $fecha_inicio,
                'creador_id' => $request->user()->id,
                'eliminado' => 0,
            ]);

            $pivotData = collect($participantIds)->mapWithKeys(function ($userId) {
                return [$userId => ['asistio' => 0, 'eliminado' => 0]];
            })->toArray();

            $meeting->users()->attach($pivotData);

            NotificationService::sendToMany(
                $participantIds,
                "Se te ha asignado a una reunión: {$meeting->titulo}",
                'reunion'
            );
            DB::commit();

            return redirect()->route('calendar')->with('success', 'Reunión creada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error interno al crear la reunión: ' . $e->getMessage());
        }
    }
    /**
     * Actualiza la reunión especificada en la base de datos.
     */
    public function update(Request $request, Meeting $meeting)
    {
        if ($request->user()->rol === 'cliente') {
            return Redirect::back()->with('error', 'No tienes permiso para modificar reuniones.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'projectId' => 'required|exists:proyectos,id',
            'participants' => 'required|array',
            'participants.*' => 'exists:users,id',
        ]);

        $meeting->update([
            'titulo' => $validated['title'],
            'descripcion' => $validated['description'],
            'fecha_hora' => $validated['start'],
            'proyecto_id' => $validated['projectId'],
        ]);

        $meeting->users()->sync($validated['participants']);
        $updatedUsers = $validated['participants'];
        NotificationService::sendToMany(
            $updatedUsers,
            "La reunión '{$meeting->titulo}' ha sido actualizada.",
            'reunion'
        );
        return Redirect::route('calendar')->with('success', 'Reunión actualizada exitosamente.');
    }

    /**
     * Marca la reunión como eliminada (Borrado Lógico)
     */
    public function destroy(Meeting $meeting)
    {
        if (request()->user()->rol === 'cliente') {
            return Redirect::back()->with('error', 'No tienes permiso para eliminar reuniones.');
        }

        if ($meeting->eliminado == 1) {
            return redirect()->back()->with('error', 'La reunión ya ha sido eliminada.');
        }

        try {
            $meeting->update(['eliminado' => 1]);

            return Redirect::route('calendar')
                ->with('success', 'La reunión se eliminó con éxito.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->with('error', 'Hubo un error al intentar eliminar la reunión: ' . $e->getMessage());
        }
    }
}
