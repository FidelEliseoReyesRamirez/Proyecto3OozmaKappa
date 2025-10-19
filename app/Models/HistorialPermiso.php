<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialPermiso extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'usuario_modificador_id',
        'usuario_afectado_id',
        'permiso_asignado',
        'fecha_cambio',
    ];

    public function proyecto() {
        return $this->belongsTo(Proyecto::class);
    }

    public function modificador() {
        return $this->belongsTo(User::class, 'usuario_modificador_id');
    }

    public function afectado() {
        return $this->belongsTo(User::class, 'usuario_afectado_id');
    }
}
