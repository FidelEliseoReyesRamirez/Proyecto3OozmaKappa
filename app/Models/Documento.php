<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User; 
use App\Models\Proyecto;

class Documento extends Model
{
    use HasFactory;

    protected $table = 'documentos'; 

    protected $fillable = [
        'proyecto_id',
        'nombre',
        'descripcion',
        'archivo_url',
        'tipo',
        'subido_por',
        'eliminado',
    ];

    protected $casts = [
        'eliminado' => 'boolean', 
        'fecha_subida' => 'datetime', 
    ];
    
    /**
     * Relación principal (Español): Usada por DocumentoHistorialController.
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id');
    }
    
    /**
     * Relación alternativa (Inglés): Resuelve el error 'Call to undefined relationship [project]'.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id');
    }

    /**
     * Relación: Un documento fue subido por un usuario.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
    
    public function scopeActivos($query)
    {
        return $query->where('eliminado', 0);
    }
}