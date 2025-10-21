<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $table = 'reuniones';

    protected $casts = [
        'fecha_hora' => 'datetime',
        'fecha_hora_fin' => 'datetime', // nuevo campo
    ];

    protected $fillable = [
        'proyecto_id',
        'titulo',
        'descripcion',
        'fecha_hora',
        'fecha_hora_fin', // nuevo campo
        'creador_id',
        'eliminado',
    ];

    /** Relación: usuarios asignados a la reunión */
    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'reuniones_usuarios',
            'reunion_id',
            'user_id'
        )->withPivot('asistio', 'eliminado')
         ->wherePivot('eliminado', 0);
    }

    /** Relación inversa: proyecto al que pertenece la reunión */
    public function project()
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id', 'id');
    }
}
