<?php

namespace App\Http\Controllers\APS;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController
{
    public function upload(Request $request)
    {
        // Validar archivo
        $request->validate([
            'file' => 'required|file|mimes:ifc,txt,zip|max:512000', // 500 MB
        ]);

        // Guardarlo en storage/app/ifc/
        $path = $request->file('file')->store('ifc');

        return response()->json([
            'success' => true,
            'message' => 'Archivo subido correctamente',
            'path'    => $path
        ]);
    }
}
