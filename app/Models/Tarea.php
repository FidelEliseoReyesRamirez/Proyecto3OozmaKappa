<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'titulo',
        'descripcion',
        'estado',
        'prioridad',
        'fecha_limite',
        'asignado_id',
        'creador_id',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function asignado()
    {
        return $this->belongsTo(User::class, 'asignado_id');
    }

    public function creador()
    {
        return $this->belongsTo(User::class, 'creador_id');
    }

    public function historial()
    {
        return $this->hasMany(TareaHistorial::class);
    }
}
