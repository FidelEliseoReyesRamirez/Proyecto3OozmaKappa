<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Documento;
use Illuminate\Support\Facades\Storage;

class PurgeOldDocuments extends Command
{
    protected $signature = 'documents:purge';
    protected $description = 'Elimina documentos con más de 30 días en papelera (eliminado = 1).';

    public function handle(): void
    {
        $expired = Documento::where('eliminado', 1)
            ->where('fecha_eliminacion', '<', now()->subDays(30))
            ->get();

        foreach ($expired as $doc) {
            if ($doc->archivo_url && Storage::exists($doc->archivo_url)) {
                Storage::delete($doc->archivo_url);
            }
            $doc->delete();
        }

        $this->info(count($expired) . ' documentos eliminados definitivamente.');
    }
}
