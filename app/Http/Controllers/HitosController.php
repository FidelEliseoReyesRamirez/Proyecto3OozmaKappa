<?php

namespace App\Http\Controllers;

use App\Models\Hitos;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;
use App\Traits\RegistraAuditoria;

class HitosController extends Controller
{
    use RegistraAuditoria;

    public function index($proyectoId)
    {
        $proyecto = Proyecto::findOrFail($proyectoId);
        $hitos = Hitos::where('proyecto_id', $proyectoId)
            ->orderBy('fecha_hito')
            ->get();

        return inertia('GestionProyecto/Hitos/Index', [
            'proyecto' => $proyecto,
            'hitos' => $hitos
        ]);
    }

    public function create($proyectoId)
    {
        $proyecto = Proyecto::findOrFail($proyectoId);

        return inertia('GestionProyecto/Hitos/Create', [
            'proyecto' => $proyecto
        ]);
    }

    public function store(Request $request, $proyectoId)
    {
        $request->validate([
            'nombre' => 'required|string|max:80',
            'fecha_hito' => 'required|date',
            'descripcion' => 'required|string|max:300',
            'estado' => 'required|string'
        ]);

        $fecha = $request->fecha_hito . ' 00:00:00';

        $hito = Hitos::create([
            'proyecto_id' => $proyectoId,
            'nombre' => $request->nombre,
            'fecha_hito' => $fecha,
            'descripcion' => $request->descripcion,
            'estado' => $request->estado,
            'encargado_id' => Auth::id(),
        ]);

        self::registrarAccionManual("Creó el hito '{$hito->nombre}'.", 'hitos', $hito->id);

        NotificationService::sendToMany(
            [Auth::id()],
            "Se creó el hito '{$hito->nombre}'",
            'hito',
            url("/proyectos/$proyectoId"),
            'Nuevo hito registrado'
        );

        return redirect()->route('hitos.index', $proyectoId);
    }

    public function update(Request $request, $proyectoId, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:80',
            'fecha_hito' => 'required|date',
            'descripcion' => 'required|string|max:300',
            'estado' => 'required|string'
        ]);

        $hito = Hitos::findOrFail($id);

        $fecha = $request->fecha_hito . ' 00:00:00';

        $hito->update([
            'nombre' => $request->nombre,
            'fecha_hito' => $fecha,
            'descripcion' => $request->descripcion,
            'estado' => $request->estado,
        ]);

        self::registrarAccionManual("Editó el hito '{$hito->nombre}'.", 'hitos', $hito->id);

        NotificationService::sendToMany(
            [Auth::id()],
            "El hito '{$hito->nombre}' fue actualizado",
            'hito',
            url("/proyectos/$proyectoId"),
            'Hito actualizado'
        );

        return back();
    }

    public function destroy($proyectoId, $id)
    {
        $hito = Hitos::findOrFail($id);
        $nombre = $hito->nombre;

        $hito->delete();

        self::registrarAccionManual("Eliminó el hito '{$nombre}'.", 'hitos', $id);

        NotificationService::sendToMany(
            [Auth::id()],
            "Se eliminó el hito '{$nombre}'",
            'hito',
            url("/proyectos/$proyectoId"),
            'Hito eliminado'
        );

        return back();
    }
}
