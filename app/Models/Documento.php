<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'documentos'; 

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'proyecto_id',
        'nombre',
        'descripcion',
        'archivo_url',
        'tipo',
        'fecha_subida', 
        'subido_por',
        'eliminado',
    ];

    /**
     * @var array<int, string>
     */
    protected $hidden = [
        // 'created_at',
        // 'updated_at',
        // 'eliminado',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     * @var array
     */
    protected $casts = [
        'eliminado' => 'boolean', 
        'fecha_subida' => 'datetime', 
    ];
    
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'proyecto_id');
    }

    /**
     * Relación: Un documento fue subido por un usuario.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
    /**
     * Scope para recuperar solo documentos activos (no eliminados).
     */
    public function scopeActivos($query)
    {
        return $query->where('eliminado', 0);
    }
}