<?php

namespace App\Services;

use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificacionGeneral;

class NotificationService
{
    /**
     * Enviar notificación a un solo usuario (con validaciones seguras)
     */
    public static function send($userId, $mensaje, $tipo = 'tarea', $url = null, $asunto = null)
    {
        // 🚫 Evitar crear notificaciones con user_id nulo o no numérico
        if (empty($userId) || !is_numeric($userId)) {
            Log::warning('⚠️ [NotificationService] Intento de enviar notificación con user_id inválido', [
                'user_id' => $userId,
                'mensaje' => $mensaje,
                'tipo' => $tipo,
            ]);
            return;
        }

        $user = User::find($userId);

        // 🚫 Si el usuario no existe o está eliminado, no enviar
        if (!$user) {
            Log::warning('⚠️ [NotificationService] Usuario no encontrado para notificación', [
                'user_id' => $userId,
                'mensaje' => $mensaje,
            ]);
            return;
        }

        // ✅ Crear la notificación
        $notificacion = Notificacion::create([
            'user_id' => $userId,
            'mensaje' => $mensaje,
            'tipo' => $tipo,
            'url' => $url,
            'asunto' => $asunto ?? ucfirst($tipo) . ' nueva',
        ]);

        // 📧 Enviar correo si el usuario tiene email
        if ($user->email) {
            try {
                Mail::to($user->email)->send(new NotificacionGeneral($notificacion));
            } catch (\Throwable $e) {
                Log::error('❌ [NotificationService] Error al enviar correo', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Enviar notificación a varios usuarios (filtra nulos automáticamente)
     */
    public static function sendToMany($userIds, $mensaje, $tipo = 'tarea', $url = null, $asunto = null)
    {
        $userIds = array_filter((array) $userIds, function ($id) {
            return !empty($id) && is_numeric($id);
        });

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
