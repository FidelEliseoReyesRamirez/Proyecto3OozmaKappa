<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'proyectos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'cliente_id',
        'responsable_id',
        'eliminado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    // Relación Many-to-Many: Un proyecto tiene muchos usuarios/empleados
    public function users()
    {
        return $this->belongsToMany(User::class, 'proyectos_usuarios', 'proyecto_id', 'user_id')
                    ->withPivot('rol_en_proyecto', 'eliminado')
                    ->wherePivot('eliminado', 0);
    }

    // Relación One-to-Many: Un proyecto tiene muchas reuniones
    public function meetings()
    {
        return $this->hasMany(Meeting::class, 'proyecto_id')->where('eliminado', 0);
    }
}