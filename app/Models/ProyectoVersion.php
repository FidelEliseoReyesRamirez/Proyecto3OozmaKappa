<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoVersion extends Model
{
    use HasFactory;

    protected $table = 'proyecto_versiones';

    protected $fillable = [
        'proyecto_id',
        'descripcion_cambio',
        'autor_id',
        'version',
        'datos_previos',
    ];

    protected $casts = [
        'datos_previos' => 'array',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function autor()
    {
        return $this->belongsTo(User::class, 'autor_id');
    }
}
