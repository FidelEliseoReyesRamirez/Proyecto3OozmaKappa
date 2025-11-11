<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\APS\TokenController;
use App\Http\Controllers\APS\UploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí irán las rutas para la API REST, incluyendo Autodesk APS.
|
*/

// Ruta de prueba
Route::get('/ping', function () {
    return ['message' => 'API funcionando'];
});

// Ruta del token APS
Route::get('/aps/token', TokenController::class);


Route::post('/aps/upload', [UploadController::class, 'upload']);

