<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TareaHistorial extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'tarea_id',
        'usuario_id',
        'estado_anterior',
        'estado_nuevo',
        'cambio',
        'fecha_cambio',
    ];

    public function tarea()
    {
        return $this->belongsTo(Tarea::class);
    }

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
