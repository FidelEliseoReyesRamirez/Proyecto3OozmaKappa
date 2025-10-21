<?php

namespace App\Services;

use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificacionGeneral;

class NotificationService
{
    /**
     * Enviar notificación a un usuario
     */
    public static function send($userId, $mensaje, $tipo = 'tarea', $url = null, $asunto = null)
    {
        // Crear notificación en la BD
        $notificacion = Notificacion::create([
            'user_id' => $userId,
            'mensaje' => $mensaje,
            'tipo' => $tipo,
            'url' => $url,
            'asunto' => $asunto ?? ucfirst($tipo) . ' nueva',
        ]);

        // Enviar correo si el usuario tiene email válido
        $user = User::find($userId);
        if ($user && $user->email) {
            Mail::to($user->email)->send(new NotificacionGeneral($notificacion));
        }
    }

    /**
     * Enviar notificación a varios usuarios
     */
    public static function sendToMany($userIds, $mensaje, $tipo = 'tarea', $url = null, $asunto = null)
    {
        foreach ($userIds as $id) {
            self::send($id, $mensaje, $tipo, $url, $asunto);
        }
    }

    /**
     * Notificación rápida de eventos de proyectos
     */
    public static function sendProjectEvent($userId, $proyecto, $accion)
    {
        $mensaje = match ($accion) {
            'creado' => "Se te ha asignado el proyecto '{$proyecto->nombre}'.",
            'actualizado' => "El proyecto '{$proyecto->nombre}' ha sido actualizado.",
            'eliminado' => "El proyecto '{$proyecto->nombre}' ha sido eliminado.",
            default => "Evento relacionado con el proyecto '{$proyecto->nombre}'.",
        };

        $url = route('proyectos.show', $proyecto->id);
        self::send($userId, $mensaje, 'proyecto', $url, "Proyecto {$accion}");
    }

    /**
     * Notificación rápida de eventos de tareas
     */
    public static function sendTaskEvent($userId, $tarea, $accion)
    {
        $mensaje = match ($accion) {
            'creada' => "Se te ha asignado la tarea '{$tarea->titulo}' en el proyecto '{$tarea->proyecto->nombre}'.",
            'actualizada' => "La tarea '{$tarea->titulo}' ha sido actualizada.",
            'eliminada' => "La tarea '{$tarea->titulo}' ha sido eliminada.",
            default => "Evento de tarea '{$tarea->titulo}'.",
        };

        $url = route('tareas.show', $tarea->id);
        self::send($userId, $mensaje, 'tarea', $url, "Tarea {$accion}");
    }

    /**
     * Notificación rápida de eventos de documentos
     */
    public static function sendDocumentEvent($userIds, $documento, $accion)
    {
        $mensaje = match ($accion) {
            'subido' => "Se ha subido el documento '{$documento->nombre}' al proyecto.",
            'actualizado' => "El documento '{$documento->nombre}' ha sido actualizado.",
            'eliminado' => "El documento '{$documento->nombre}' ha sido eliminado del proyecto.",
            default => "Evento de documento '{$documento->nombre}'.",
        };

        $url = route('docs.index');
        self::sendToMany($userIds, $mensaje, 'documento', $url, "Documento {$accion}");
    }
}
