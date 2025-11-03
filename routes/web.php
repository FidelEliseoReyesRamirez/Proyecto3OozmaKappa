<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\DocController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\DocumentoHistorialController;
use App\Http\Controllers\AvancesProyectoController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\AuditoriaController;
/*
|--------------------------------------------------------------------------
| Rutas Web
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Sección autenticada general
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', PreventManualUrlAccess::class])->group(function () {

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Calendario
    Route::get('/calendar', [MeetingController::class, 'index'])->name('calendar');
    Route::resource('meetings', MeetingController::class)->only(['store', 'update', 'destroy']);

    // Documentos
    Route::prefix('docs')->name('docs.')->group(function () {
        Route::get('/', [DocController::class, 'index'])->name('index');
        Route::get('/create', [DocController::class, 'create'])->name('create');
        Route::post('/', [DocController::class, 'store'])->name('store');

        // ✅ Ruta de descarga de Documentos (Original: mantiene el middleware)
        Route::get('/download/{documento}', [DocController::class, 'download'])
            ->middleware(['auth', PreventManualUrlAccess::class])
            ->name('download');

        Route::delete('/{documento}', [DocController::class, 'destroy'])->name('destroy');
        Route::get('/{documento}/edit', [DocController::class, 'edit'])->name('edit');
        Route::put('/{documento}', [DocController::class, 'update'])->name('update');

        // Papelera y restauración
        Route::get('/trash', [DocController::class, 'trash'])->name('trash');
        Route::patch('/{id}/restore', [DocController::class, 'restore'])->name('restore');

        // Purga manual (solo admin)
        Route::middleware('role:admin')->delete('/purge', [DocController::class, 'purgeOld'])->name('purge');
    });
    
    // ⭐ PLANOS BIM: CORREGIDO ⭐
    Route::prefix('planos')->name('planos.')->group(function () {
    
        // Vistas principales (CRUD base)
        Route::get('/', [PlanoController::class, 'index'])->name('index');
        Route::get('/create', [PlanoController::class, 'create'])->name('create');
        Route::post('/', [PlanoController::class, 'store'])->name('store');

        // 📥 RUTA DE DESCARGA: Excluye el middleware 'PreventManualUrlAccess' 
        Route::get('/download/{plano}', [PlanoController::class, 'download'])
            ->withoutMiddleware(PreventManualUrlAccess::class) 
            ->name('download');
        
        // Edición y Actualización
        Route::get('/{plano}/edit', [PlanoController::class, 'edit'])->name('edit');
        Route::put('/{plano}', [PlanoController::class, 'update'])->name('update');
        
        // Eliminación (a papelera)
        Route::delete('/{plano}', [PlanoController::class, 'destroy'])->name('destroy');
        
        // ⭐ CORRECCIÓN 1: ELIMINACIÓN PERMANENTE INDIVIDUAL
        // Ruta: /planos/{plano}/permanentemente
        Route::delete('/{plano}/permanentemente', [PlanoController::class, 'forceDestroy'])->name('forceDestroy');
        
        // Papelera y restauración
        Route::get('/trash', [PlanoController::class, 'trash'])->name('trash');
        Route::patch('/{id}/restore', [PlanoController::class, 'restore'])->name('restore');
    });

    // Proyectos
    Route::resource('proyectos', ProyectoController::class);
    Route::get('/proyectos/{id}/versiones', [ProyectoController::class, 'versiones'])->name('proyectos.versiones');
    Route::patch('/proyectos/{id}/estado', [ProyectoController::class, 'cambiarEstado'])->name('proyectos.cambiarEstado');

    // Permisos de proyectos
    Route::get('/proyectos/{id}/permisos', [ProyectoController::class, 'gestionarPermisos'])->name('proyectos.permisos');
    Route::post('/proyectos/{id}/permisos', [ProyectoController::class, 'actualizarPermisos'])->name('proyectos.permisos.actualizar');

    // Avances de proyectos
    Route::get('/proyectos/{projectId}/timeline', [AvancesProyectoController::class, 'showTimeline'])->name('projects.timeline');
    Route::get('/mis-avances', [AvancesProyectoController::class, 'showClientTimeline'])->name('avances.index');
    Route::post('/projects/{id}/update-status', [AvancesProyectoController::class, 'updateStatus'])->name('projects.updateStatus');
    Route::get('/projects/{projectId}/report/pdf', [AvancesProyectoController::class, 'downloadReport'])->name('projects.report.pdf');

    // Tareas
    Route::get('/tareas', [TareaController::class, 'index'])->name('tareas.index');
    Route::get('/tareas/create/{proyecto_id?}', [TareaController::class, 'create'])->name('tareas.create');
    Route::post('/tareas', [TareaController::class, 'store'])->name('tareas.store');
    Route::get('/tareas/proyecto/{id}', [TareaController::class, 'obtenerPorProyecto'])->name('tareas.proyecto');
    Route::patch('/tareas/{id}/estado', [TareaController::class, 'actualizarEstado'])->name('tareas.estado');
    Route::get('/tareas/{id}/historial', [TareaController::class, 'historial'])->name('tareas.historial');
});
/*
|--------------------------------------------------------------------------
| Sección de administración (solo admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin', PreventManualUrlAccess::class])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
    Route::get('/usuarios/eliminados', [UserController::class, 'eliminados'])->name('users.eliminados');
    Route::get('/usuarios/create', [UserController::class, 'create'])->name('users.create');
    Route::get('/usuarios/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::post('/usuarios', [UserController::class, 'store'])->name('users.store');
    Route::patch('/usuarios/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/usuarios/{user}/estado', [UserController::class, 'updateEstado'])->name('users.updateEstado');
    Route::patch('/usuarios/{user}/eliminar', [UserController::class, 'eliminar'])->name('users.eliminar');
    Route::patch('/usuarios/{user}/restaurar', [UserController::class, 'restaurar'])->name('users.restaurar');

    Route::get('/admin/documents/history', [DocumentoHistorialController::class, 'showDownloadHistory'])
        ->name('documents.history');
    Route::get('/admin/auditorias', [AuditoriaController::class, 'index'])->name('auditoria.index');
});

/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/
Route::get('/portafolio', fn() => Inertia::render('Public/Projects'))->name('projects');
Route::get('/carreras', fn() => Inertia::render('Public/Career'))->name('career');
Route::get('/servicios', fn() => Inertia::render('Public/Services'))->name('services');
Route::get('/acercadenosotros', fn() => Inertia::render('Public/AboutUs'))->name('aboutus');

/*
|--------------------------------------------------------------------------
| Autenticación
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Rutas de notificaciones
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', PreventManualUrlAccess::class])->group(function () {
    Route::get('/notificaciones', [NotificacionController::class, 'index'])->name('notificaciones.index');
    Route::post('/notificaciones/{id}/leida', [NotificacionController::class, 'marcarComoLeida'])->name('notificaciones.marcar');
    Route::post('/notificaciones/leidas/todas', [NotificacionController::class, 'marcarTodasComoLeidas'])->name('notificaciones.marcarTodas');
    Route::post('/notificaciones/{id}/eliminar', [NotificacionController::class, 'eliminar'])->name('notificaciones.eliminar');
});

/*
|--------------------------------------------------------------------------
| Fallback 404
|--------------------------------------------------------------------------
*/
Route::fallback(function () {
    return Inertia::render('Errors/NotFound', [
        'title' => 'Página no encontrada',
        'message' => 'La página que buscas no existe.',
    ])->toResponse(request())->setStatusCode(404);
});

Route::post('/users/verificar-duplicado', [UserController::class, 'verificarDuplicado'])
    ->name('users.verificarDuplicado');

