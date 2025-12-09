<?php

namespace App\Services;

class FbxConverterService
{
    private string $exePath;

    public function __construct()
    {
        // Ruta absoluta al binario Linux
        $this->exePath = base_path('tools/fbx2gltf-linux');
    }

    /**
     * Convierte un archivo FBX a GLB usando fbx2gltf-linux
     */
    public function convertirFbxAGlb(string $rutaFbx, string $rutaSalida): bool
    {
        // Comando: binario, entrada, salida binaria
        $cmd = escapeshellcmd($this->exePath)
     . ' ' . escapeshellarg(realpath($rutaFbx))
     . ' --binary -o ' . escapeshellarg($rutaSalida);

// Ejecutar y capturar salida y código
exec($cmd . ' 2>&1', $salida, $codigo);

// Guardar log
$logFile = storage_path('logs/fbx2gltf.log');
file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] Comando: $cmd\n", FILE_APPEND);
file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] Salida:\n" . implode("\n", $salida) . "\nCódigo: $codigo\n\n", FILE_APPEND);

return $codigo === 0 && file_exists($rutaSalida);

    }
}
