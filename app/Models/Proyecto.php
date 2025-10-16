<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;

    protected $table = 'proyectos'; // importante si no sigue convención

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

    // Cliente dueño del proyecto
    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }

    // Responsable del proyecto
    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    // Planos BIM
    public function planos()
    {
        return $this->hasMany(PlanoBim::class, 'proyecto_id');
    }

    // Usuarios asignados (pivot proyectos_usuarios)
    public function users()
    {
        return $this->belongsToMany(User::class, 'proyectos_usuarios', 'proyecto_id', 'user_id')
            ->withPivot('rol_en_proyecto', 'eliminado')
            ->wherePivot('eliminado', 0);
    }

    // Reuniones del proyecto
    public function meetings()
    {
        return $this->hasMany(Meeting::class, 'proyecto_id')
            ->where('eliminado', 0);
    }
}
