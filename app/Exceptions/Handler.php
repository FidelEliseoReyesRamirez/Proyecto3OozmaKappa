<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        // ARCHIVO MUY GRANDE (413)
        if ($e instanceof PostTooLargeException) {
            return Inertia::render('Errors/FileTooLarge', [
                'title' => 'Archivo demasiado grande',
                'message' => 'El archivo que intentas subir excede el tamaño máximo permitido (100 MB).',
            ])->toResponse($request)->setStatusCode(413);
        }

        // 403 - Acceso denegado
        if (
            $e instanceof AuthorizationException ||
            ($e instanceof HttpException && $e->getStatusCode() === 403)
        ) {
            return Inertia::render('Errors/Forbidden', [
                'title' => 'Acceso denegado',
                'message' => 'No tienes permiso para acceder a esta sección o realizar esta acción.',
            ])->toResponse($request)->setStatusCode(403);
        }

        // 404 - Página o recurso no encontrado (también ModelNotFound)
        if (
            $e instanceof NotFoundHttpException ||
            $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException
        ) {

            // Forzar respuesta Inertia incluso sin cabecera
            if ($request->expectsJson() || $request->isXmlHttpRequest()) {
                return response()->json(['message' => 'Página no encontrada'], 404);
            }

            return Inertia::render('Errors/NotFound', [
                'title' => 'Página no encontrada',
                'message' => 'La página que buscas no existe o ha sido eliminada.',
            ])->toResponse($request)->setStatusCode(404);
        }

        // 500 - Error interno del servidor
        if (
            $e instanceof HttpException &&
            $e->getStatusCode() === 500
        ) {
            return Inertia::render('Errors/ServerError', [
                'title' => 'Error interno del servidor',
                'message' => 'Ha ocurrido un problema inesperado. Intenta nuevamente o contacta al administrador.',
            ])->toResponse($request)->setStatusCode(500);
        }

        return parent::render($request, $e);
    }
}
