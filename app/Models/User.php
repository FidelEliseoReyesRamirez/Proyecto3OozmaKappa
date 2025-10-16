<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use App\Models\Proyecto;

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
     * Relación: proyectos en los que el usuario participa
     */
    public function projects(): BelongsToMany
    {
        $userRole = $this->rol;


        $relation = $this->belongsToMany(Proyecto::class, 'proyectos_usuarios', 'user_id', 'proyecto_id')
            ->select('proyectos.id', 'proyectos.nombre')
            ->withPivot('rol_en_proyecto', 'eliminado')
            ->wherePivot('eliminado', 0);

        if (strtolower($userRole) === 'cliente') {
            $relation->wherePivot('rol_en_proyecto', 'cliente');
        }

        return $relation;
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\CustomVerifyEmail);
    }

    /**
     * Relación: notificaciones del usuario
     */
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'user_id')
            ->where('eliminado', 0)
            ->orderBy('fecha_envio', 'desc');
    }
}
