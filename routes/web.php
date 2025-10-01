<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::middleware('auth')->group(function () {
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // CRUD usuarios
    Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
    Route::get('/usuarios/eliminados', [UserController::class, 'eliminados'])->name('users.eliminados');
    Route::get('/usuarios/create', [UserController::class, 'create'])->name('users.create');
    Route::get('/usuarios/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::post('/usuarios', [UserController::class, 'store'])->name('users.store');
    Route::patch('/usuarios/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/usuarios/{user}/estado', [UserController::class, 'updateEstado'])->name('users.updateEstado');
    Route::patch('/usuarios/{user}/eliminar', [UserController::class, 'eliminar'])->name('users.eliminar');
    Route::patch('/usuarios/{user}/restaurar', [UserController::class, 'restaurar'])->name('users.restaurar');
});

//Rutas Publicas
Route::group([], function(){
    Route::get('/proyectos', function () {
        return Inertia::render('Public/Projects'); 
    })->name('projects'); 
    Route::get('/carreras', function () {
        return Inertia::render('Public/Career'); 
    })->name('career'); 
    Route::get('/servicios', function () {
        return Inertia::render('Public/Services'); 
    })->name('services'); 
    Route::get('/acercadenosotros', function () {
        return Inertia::render('Public/AboutUs'); 
    })->name('aboutus'); 
});

require __DIR__.'/auth.php';
