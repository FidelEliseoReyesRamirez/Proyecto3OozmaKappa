<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'apellido',
        'email',
        'password',
        'telefono',
        'rol',
        'estado',
        'intentos_fallidos',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación: Los proyectos en los que participa el usuario a través de la tabla pivot.
     * @return BelongsToMany
     */
    public function projects(): BelongsToMany
    {
        // Obtener la instancia del modelo para acceder al rol del usuario
        $userRole = $this->rol;

        $relation = $this->belongsToMany(Project::class, 'proyectos_usuarios', 'user_id', 'proyecto_id')
            // Seleccionar explícitamente las columnas para evitar ambigüedad (esto ya lo tenías)
            ->select('proyectos.id', 'proyectos.nombre')
            ->withPivot('rol_en_proyecto', 'eliminado')
            ->wherePivot('eliminado', 0);

        // 🛑 NUEVA RESTRICCIÓN: Si el usuario es un 'cliente', solo trae proyectos donde 
        // su rol en la tabla pivot es 'cliente'.
        if (strtolower($userRole) === 'cliente') {
            $relation->wherePivot('rol_en_proyecto', 'cliente');
        }

        // Si el usuario no es 'cliente' (ej: 'arquitecto', 'ingeniero'), traerá todos
        // los proyectos asignados, independientemente de su rol_en_proyecto.

        return $relation;
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\CustomVerifyEmail);
    }
    //función para notificaciones
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'user_id')
            ->where('eliminado', 0)
            ->orderBy('fecha_envio', 'desc');
    }
}
