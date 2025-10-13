<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'proyectos_usuarios', 'user_id', 'proyecto_id')
                    ->withPivot('rol_en_proyecto', 'eliminado')
                    ->wherePivot('eliminado', 0); 
    }
    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\CustomVerifyEmail);
    }
}
