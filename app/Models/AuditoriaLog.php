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
        'tabla_afectada',
        'id_registro_afectado',
        'fecha_accion',
        'ip_usuario',
        'eliminado',
    ];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
