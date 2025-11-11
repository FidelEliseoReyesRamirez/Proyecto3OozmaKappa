<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class CreateApsBucket extends Command
{
    protected $signature = 'aps:bucket';
    protected $description = 'Crear bucket BIM en Autodesk APS para almacenamiento de modelos';

    public function handle()
    {
        $this->info("🔧 Iniciando creación del bucket BIM en Autodesk APS...");

        // 1) Obtener token
        $this->line("🔑 Solicitando token de autenticación...");

        $tokenResponse = Http::withOptions(['verify' => false])
            ->asForm()
            ->post(config('services.aps.base_url') . '/authentication/v2/token', [
                'grant_type' => 'client_credentials',
                'client_id' => config('services.aps.client_id'),
                'client_secret' => config('services.aps.client_secret'),
                'scope' => 'data:read data:write bucket:create bucket:read'
            ]);

        if (!$tokenResponse->ok()) {
            $this->error("❌ Error al obtener token APS:");
            $this->line($tokenResponse->body());
            return;
        }

        $token = $tokenResponse->json()['access_token'];

        // 2) Crear bucket
        $bucketKey = config('services.aps.bucket');

        $this->line("📦 Creando bucket: {$bucketKey}");

        $createResponse = Http::withOptions(['verify' => false])
            ->withToken($token)
            ->post(config('services.aps.base_url') . '/oss/v2/buckets', [
                'bucketKey' => $bucketKey,
                'policyKey' => 'persistent'
            ]);

        $this->info("✅ Respuesta de Autodesk APS:");
        $this->line($createResponse->body());
        $this->info("🎉 Bucket creado correctamente (o ya existente).");
    }
}
