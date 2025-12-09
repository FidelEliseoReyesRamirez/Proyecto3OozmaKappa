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
use App\Traits\RegistraAuditoria; 

class MeetingController extends Controller
{
    use RegistraAuditoria; 

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
            $query->whereHas('users', fn($q) => $q->where('user_id', $user->id));
        } elseif (in_array($userRole, ['arquitecto', 'ingeniero'])) {
            $assignedProjectIds = $user->projects->pluck('id');
            if ($assignedProjectIds->isNotEmpty()) {
                $query->whereIn('proyecto_id', $assignedProjectIds);
            } else {
                $query->whereHas('users', fn($q) => $q->where('user_id', $user->id));
            }
        }

        $meetings = $query->get();

        $formattedMeetings = $meetings->map(function ($meeting) {
            if (is_null($meeting->fecha_hora)) return null;

            $end_time = $meeting->fecha_hora_fin ?? $meeting->fecha_hora->copy()->addHour();

            return [
                'id' => $meeting->id,
                'title' => $meeting->titulo,
                'start' => $meeting->fecha_hora->toDateTimeString(),
                'end' => $end_time->toDateTimeString(),
                'description' => $meeting->descripcion,
                'projectId' => $meeting->proyecto_id,
                'projectTitle' => $meeting->project->nombre ?? 'Proyecto Eliminado',
                'participants' => $meeting->users->pluck('id')->toArray(),
            ];
        })->filter()->values();

        $usersList = User::where('eliminado', 0)
            ->get(['id', 'name', 'apellido'])
            ->map(fn($u) => ['id' => $u->id, 'name' => "{$u->name} {$u->apellido}"]);

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
     * Crea una nueva reunión.
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

        // Comprobar conflictos de horario
        $overlappingMeetingIds = Meeting::where('eliminado', 0)
            ->where(function ($query) use ($fecha_inicio, $fecha_fin) {
                $query->where('fecha_hora', '<', $fecha_fin)
                      ->where('fecha_hora_fin', '>', $fecha_inicio);
            })
            ->pluck('id');

        if ($overlappingMeetingIds->isNotEmpty()) {
            $conflictingUsers = User::whereIn('id', $participantIds)
                ->whereHas('meetings', fn($q) =>
                    $q->whereIn('reuniones.id', $overlappingMeetingIds)
                )->get(['name', 'apellido']);

            if ($conflictingUsers->isNotEmpty()) {
                $names = $conflictingUsers->pluck('name')->implode(', ');
                return redirect()->back()->withErrors([
                    'time_conflict' =>
                        "Conflicto de horario. Los siguientes participantes ya tienen una reunión agendada: {$names}.",
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
                'fecha_hora_fin' => $fecha_fin,
                'creador_id' => $request->user()->id,
                'eliminado' => 0,
            ]);

            $pivotData = collect($participantIds)->mapWithKeys(fn($userId) => [
                $userId => ['asistio' => 0, 'eliminado' => 0]
            ])->toArray();

            $meeting->users()->attach($pivotData);

            // 🔔 NOTIFICACIÓN
            $proyecto = Proyecto::find($meeting->proyecto_id);
            $responsable = $proyecto->responsable_id ?? null;
            $cliente = $proyecto->cliente_id ?? null;

            $colaboradores = DB::table('proyectos_usuarios')
                ->where('proyecto_id', $proyecto->id)
                ->where('permiso', 'editar')
                ->pluck('user_id')
                ->toArray();

            $destinatarios = array_unique(array_filter(array_merge(
                $participantIds,
                [$request->user()->id, $responsable, $cliente],
                $colaboradores
            )));

            NotificationService::sendToMany(
                $destinatarios,
                "Se ha programado una nueva reunión: '{$meeting->titulo}' del proyecto '{$proyecto->nombre}'.",
                'reunion',
                url('/proyectos/' . $proyecto->id),
                'Nueva reunión programada'
            );

            // AUDITORÍA
            self::registrarAccionManual(
                "Creó la reunión '{$meeting->titulo}' del proyecto '{$proyecto->nombre}'",
                'reuniones',
                $meeting->id
            );

            DB::commit();
            return redirect()->route('calendar')->with('success', 'Reunión creada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error interno al crear la reunión: ' . $e->getMessage());
        }
    }

    /**
     * Actualiza una reunión existente.
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
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id',
        ]);

        $meeting->update([
            'titulo' => $validated['title'],
            'descripcion' => $validated['description'],
            'fecha_hora' => $validated['start'],
            'fecha_hora_fin' => $validated['end'],
            'proyecto_id' => $validated['projectId'],
        ]);

        $meeting->users()->sync($validated['participants']);

        // 🔔 NOTIFICACIÓN
        $proyecto = Proyecto::find($meeting->proyecto_id);
        $responsable = $proyecto->responsable_id ?? null;
        $cliente = $proyecto->cliente_id ?? null;

        $colaboradores = DB::table('proyectos_usuarios')
            ->where('proyecto_id', $proyecto->id)
            ->where('permiso', 'editar')
            ->pluck('user_id')
            ->toArray();

        $destinatarios = array_unique(array_filter(array_merge(
            $validated['participants'],
            [$request->user()->id, $responsable, $cliente],
            $colaboradores
        )));

        NotificationService::sendToMany(
            $destinatarios,
            "La reunión '{$meeting->titulo}' del proyecto '{$proyecto->nombre}' ha sido actualizada.",
            'reunion',
            url('/proyectos/' . $proyecto->id),
            'Reunión actualizada'
        );

        //  AUDITORÍA
        self::registrarAccionManual(
            "Actualizó la reunión '{$meeting->titulo}' del proyecto '{$proyecto->nombre}'",
            'reuniones',
            $meeting->id
        );

        return Redirect::route('calendar')->with('success', 'Reunión actualizada exitosamente.');
    }

    /**
     * Eliminación lógica.
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

            $proyecto = Proyecto::find($meeting->proyecto_id);
            $responsable = $proyecto->responsable_id ?? null;
            $cliente = $proyecto->cliente_id ?? null;

            $colaboradores = DB::table('proyectos_usuarios')
                ->where('proyecto_id', $proyecto->id)
                ->where('permiso', 'editar')
                ->pluck('user_id')
                ->toArray();

            $participantIds = $meeting->users()->pluck('users.id')->toArray();

            $destinatarios = array_unique(array_filter(array_merge(
                $participantIds,
                [$responsable, $cliente],
                $colaboradores
            )));

            NotificationService::sendToMany(
                $destinatarios,
                "La reunión '{$meeting->titulo}' del proyecto '{$proyecto->nombre}' ha sido eliminada.",
                'reunion',
                url('/proyectos/' . $proyecto->id),
                'Reunión cancelada'
            );

            //  AUDITORÍA
            self::registrarAccionManual(
                "Eliminó la reunión '{$meeting->titulo}' del proyecto '{$proyecto->nombre}'",
                'reuniones',
                $meeting->id,
                true
            );

            return Redirect::route('calendar')->with('success', 'La reunión se eliminó con éxito.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Hubo un error al eliminar la reunión: ' . $e->getMessage());
        }
    }
}
