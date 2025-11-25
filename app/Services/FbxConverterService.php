<?php

namespace App\Services;

class FbxConverterService
{
    private string $exePath;

    public function __construct()
    {
        // Ruta absoluta del convertidor
        $this->exePath = base_path('tools/FBX2glTF-windows-x64.exe');
    }

    /**
     * Convierte un archivo FBX a GLB usando FBX2glTF
     */
    public function convertirFbxAGlb(string $rutaFbx, string $rutaSalida): bool
    {
        // Comando
        $cmd = "\"{$this->exePath}\" \"{$rutaFbx}\" -o \"{$rutaSalida}\" --binary";

        // Ejecutar
        $salida = [];
        $codigo = 0;

        exec($cmd, $salida, $codigo);

        return $codigo === 0 && file_exists($rutaSalida);
    }
}
