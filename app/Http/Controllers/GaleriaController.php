<?php

namespace App\Http\Controllers;

use App\Models\GaleriaImagen;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;
use App\Traits\RegistraAuditoria;

class GaleriaController extends Controller
{
    use RegistraAuditoria;

    public function index($proyectoId)
    {
        $proyecto = Proyecto::findOrFail($proyectoId);

        // Solo personas relacionadas + admin ven la galería
        $this->autorizar($proyecto);

        $imagenes = GaleriaImagen::where('proyecto_id', $proyectoId)
            ->where('eliminado', 0)
            ->orderByDesc('created_at')
            ->get();

        return inertia('GestionProyecto/Galeria', [
            'proyecto' => $proyecto,
            'imagenes' => $imagenes,
            'user'     => Auth::user()
        ]);
    }

    public function store(Request $request, $proyectoId)
    {
        $proyecto = Proyecto::findOrFail($proyectoId);
        $this->autorizar($proyecto);

        $request->validate([
            'imagen' => 'required|image|max:10240|mimes:jpg,jpeg,png,webp',
        ]);


        $path = $request->file('imagen')->store('galeria', 'public');

        $img = GaleriaImagen::create([
            'proyecto_id' => $proyectoId,
            'titulo' => $request->input('titulo'),
            'archivo_url' => $path,
            'subido_por' => Auth::id(),
        ]);

        self::registrarAccionManual(
            "Subió una imagen a la galería del proyecto '{$proyecto->nombre}'.",
            'galeria_imagenes',
            $img->id
        );

        // Notificar al responsable + colaboradores (no al cliente)
        NotificationService::sendToMany(
            $proyecto->users()->where('rol_en_proyecto', '!=', 'cliente')->pluck('users.id'),
            "Se agregó una nueva imagen en el proyecto: {$proyecto->nombre}",
            'documento',
            url("/proyectos/$proyectoId"),
            'Nueva imagen en galería'
        );

        return back();
    }

    public function destroy($proyectoId, $id)
    {
        $imagen = GaleriaImagen::findOrFail($id);

        $proyecto = Proyecto::findOrFail($proyectoId);
        $this->autorizar($proyecto);

        $imagen->update(['eliminado' => 1]);

        self::registrarAccionManual(
            "Eliminó una imagen de la galería del proyecto '{$proyecto->nombre}'.",
            'galeria_imagenes',
            $id
        );

        return back();
    }

    private function autorizar($proyecto)
    {
        $user = Auth::user();

        // Cliente solo puede ver, no subir
        if ($user->rol === 'cliente') {
            return;
        }

        // Arquitectos, ingenieros, admin
        if ($user->rol === 'admin' || $user->rol === 'arquitecto' || $user->rol === 'ingeniero') {
            return;
        }

        abort(403, 'No tienes permiso para acceder a la galería.');
    }
}
