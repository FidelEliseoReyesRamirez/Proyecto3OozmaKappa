<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditoriaLog extends Model
{
    use HasFactory;

    protected $table = 'auditoria_logs';

    protected $fillable = [
        'user_id',
        'accion',
        'descripcion_detallada',
        'tabla_afectada',
        'id_registro_afectado',
        'ip_address',
        'fecha_accion',
        'eliminado',
    ];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
