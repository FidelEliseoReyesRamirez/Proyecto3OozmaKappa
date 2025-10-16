<?php

namespace App\Services;

use App\Models\Notificacion;

class NotificationService
{
    public static function send($userId, $mensaje, $tipo = 'tarea')
    {
        Notificacion::create([
            'user_id' => $userId,
            'mensaje' => $mensaje,
            'tipo' => $tipo,
        ]);
    }

    public static function sendToMany($userIds, $mensaje, $tipo = 'tarea')
    {
        foreach ($userIds as $id) {
            self::send($id, $mensaje, $tipo);
        }
    }
}
