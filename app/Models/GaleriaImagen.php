<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GaleriaImagen extends Model
{
    protected $table = 'galeria_imagenes';

    protected $fillable = [
        'proyecto_id',
        'titulo',
        'archivo_url',
        'subido_por',
        'eliminado',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
}
