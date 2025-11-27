<?php

namespace App\Traits;

use App\Models\AuditoriaLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait RegistraAuditoria
{
    public static function bootRegistraAuditoria()
    {
        // vacío
    }

    public static function registrarAccionManual(
        string $accion,
        string $tabla,
        ?int $idRegistro = null,
        bool $eliminado = false,
        ?string $descripcion = null
    ) {
        try {
            $descripcionDetallada = $descripcion ?? self::generarDescripcionDetallada(
                $accion,
                $tabla,
                $idRegistro,
                $eliminado
            );

            AuditoriaLog::create([
                'user_id' => Auth::id(),
                'accion' => $accion,
                'descripcion_detallada' => $descripcionDetallada,
                'tabla_afectada' => $tabla,
                'id_registro_afectado' => $idRegistro,
                'ip_address' => request()->ip(),
                'fecha_accion' => now(),
                'eliminado' => $eliminado ? 1 : 0,
            ]);
        } catch (\Throwable $th) {
            Log::warning("Auditoría error: " . $th->getMessage());
        }
    }

    public static function generarDescripcionDetallada(
        string $accion,
        string $tabla,
        ?int $idRegistro,
        bool $eliminado
    ) {
        return "Acción: {$accion}
Tabla afectada: {$tabla}
ID del registro: " . ($idRegistro ?? "—") . "
Usuario autenticado: " . (Auth::user()->name ?? "Invitado") . "
ID usuario: " . (Auth::id() ?? "—") . "
IP del cliente: " . request()->ip() . "
Método HTTP: " . request()->method() . "
Ruta ejecutada: " . request()->fullUrl() . "
User Agent: " . request()->userAgent() . "
Acción marcó eliminación?: " . ($eliminado ? "Sí" : "No") . "
Fecha exacta: " . now()->format('d/m/Y H:i:s');
    }
}
