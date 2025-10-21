<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Throwable;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        // 🧠 Log para debug (ver tipo de excepción real en storage/logs/laravel.log)
        Log::debug('⚠️ Excepción capturada: ' . get_class($e));

        // ⚠️ ARCHIVO MUY GRANDE (413 Payload Too Large)
        if ($e instanceof PostTooLargeException) {
            if ($request->header('X-Inertia')) {
                return back()
                    ->with('error', 'El archivo que intentas subir excede el tamaño máximo permitido (100 MB).')
                    ->withInput();
            }

            return response()->view('errors.generic', [
                'code' => 413,
                'title' => 'Archivo demasiado grande',
                'message' => 'El archivo que intentas subir excede el tamaño máximo permitido (100 MB).',
            ], 413);
        }

        // 🚫 ACCESO DENEGADO (403 Forbidden)
        if ($e instanceof AuthorizationException || ($e instanceof HttpException && $e->getStatusCode() === 403)) {
            if ($request->header('X-Inertia')) {
                return Inertia::render('Errors/Forbidden', [
                    'title' => 'Acceso denegado',
                    'message' => 'No tienes permiso para acceder a esta sección o realizar esta acción.',
                ])->toResponse($request)->setStatusCode(403);
            }

            return response()->view('errors.generic', [
                'code' => 403,
                'title' => 'Acceso denegado',
                'message' => 'No tienes permiso para acceder a esta sección o realizar esta acción.',
            ], 403);
        }

        // ❌ PÁGINA NO ENCONTRADA (404 Not Found)
        if ($e instanceof NotFoundHttpException) {
            if ($request->header('X-Inertia')) {
                return Inertia::render('Errors/NotFound', [
                    'title' => 'Página no encontrada',
                    'message' => 'La página que buscas no existe o ha sido eliminada.',
                ])->toResponse($request)->setStatusCode(404);
            }

            return response()->view('errors.generic', [
                'code' => 404,
                'title' => 'Página no encontrada',
                'message' => 'La página que buscas no existe o ha sido eliminada.',
            ], 404);
        }
        if ($e instanceof PostTooLargeException) {
            return back()->with('error', 'El archivo supera el tamaño máximo permitido (100 MB).')->withInput();
        }

        // 💣 ERRORES 500 (INTERNOS)
        if ($e instanceof HttpException && $e->getStatusCode() === 500) {
            if ($request->header('X-Inertia')) {
                return Inertia::render('Errors/ServerError', [
                    'title' => 'Error interno del servidor',
                    'message' => 'Ha ocurrido un problema inesperado. Por favor, intenta nuevamente o contacta al administrador.',
                ])->toResponse($request)->setStatusCode(500);
            }

            return response()->view('errors.generic', [
                'code' => 500,
                'title' => 'Error interno del servidor',
                'message' => 'Ha ocurrido un problema inesperado. Por favor, intenta nuevamente o contacta al administrador.',
            ], 500);
        }

        // ⬇️ Otros errores no capturados, Laravel los maneja normalmente
        return parent::render($request, $e);
    }
}
