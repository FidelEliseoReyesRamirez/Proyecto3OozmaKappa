<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        // 👇 esto asegura que solo se aplique a requests Inertia (frontend)
        if ($request->header('X-Inertia')) {
            if ($e instanceof NotFoundHttpException) {
                return Inertia::render('Errors/NotFound', [
                    'title' => 'Página no encontrada',
                    'message' => 'La página que buscas no existe.',
                ])->toResponse($request)->setStatusCode(404);
            }
        }

        return parent::render($request, $e);
    }
}
