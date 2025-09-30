<?php

use App\Http\Controllers\ProfileController;
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
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group([], function(){
    Route::get('/proyectos', function () {
        return Inertia::render('Public/Projects'); 
    })->name('projects'); 
    Route::get('/Career', function () {
        return Inertia::render('Contact'); 
    })->name('contact'); 
    Route::get('/Services', function () {
        return Inertia::render('Contact'); 
    })->name('contact'); 
    Route::get('/AboutUs', function () {
        return Inertia::render('Contact'); 
    })->name('contact'); 
});

require __DIR__.'/auth.php';
