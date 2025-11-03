<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Proyecto;
use App\Traits\RegistraAuditoria;

class Documento extends Model
{
    use HasFactory, RegistraAuditoria;

    protected $table = 'documentos';

    protected $fillable = [
        'proyecto_id',
        'nombre',
        'descripcion',
        'archivo_url',
        'enlace_externo',
        'tipo',
        'subido_por',
        'eliminado',
        'fecha_eliminacion',
    ];

    protected $casts = [
        'eliminado' => 'boolean',
        'fecha_subida' => 'datetime',
        'fecha_eliminacion' => 'datetime',
    ];

    protected $with = ['proyecto', 'uploader'];

    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por');
    }

    public function scopeActivos($query)
    {
        return $query->where('eliminado', 0);
    }

    public function scopeEliminados($query)
    {
        return $query->where('eliminado', 1);
    }

    public function getTipoArchivoAttribute(): string
    {
        return match (strtolower($this->tipo)) {
            'pdf' => 'Documento PDF',
            'excel' => 'Hoja de cálculo Excel',
            'word' => 'Documento Word',
            'url' => 'Enlace externo',
            default => ucfirst($this->tipo ?? 'Otro'),
        };
    }
}
