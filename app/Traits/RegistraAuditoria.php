<?php

namespace App\Traits;

use App\Models\AuditoriaLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait RegistraAuditoria
{
    // Desactivamos los eventos automáticos de created/updated/deleted
    public static function bootRegistraAuditoria()
    {
        // intencionalmente vacío
    }

    /**
     * Registra una acción manual, con texto libre (más descriptivo)
     * Ejemplo: "Subió el documento 'Manual.pdf' al proyecto 'Planta Sur'"
     */
    public static function registrarAccionManual(string $accion, string $tabla, ?int $idRegistro = null, bool $eliminado = false): void
    {
        try {
            AuditoriaLog::create([
                'user_id' => Auth::id(),
                'accion' => $accion, // texto completo, no "Creación", "Actualización"
                'tabla_afectada' => $tabla,
                'id_registro_afectado' => $idRegistro,
                'fecha_accion' => now(),
                'eliminado' => $eliminado ? 1 : 0,
            ]);
        } catch (\Throwable $th) {
            Log::warning('No se pudo registrar auditoría manual: ' . $th->getMessage());
        }
    }
}
