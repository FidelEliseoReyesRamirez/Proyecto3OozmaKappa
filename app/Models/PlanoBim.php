<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanoBIM extends Model
{
    use HasFactory;
    
    // Nombre de la tabla
    protected $table = 'planos_bim'; 

    // Campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombre',
        'descripcion',
        'proyecto_id',
        'archivo_url',
        'version',
        'subido_por',
        'fecha_subida',
        'eliminado',
    ];

    // 💡 CORRECCIÓN CRÍTICA: Casts para convertir automáticamente a objetos Carbon (fechas)
    protected $casts = [
        'eliminado' => 'boolean',
        'fecha_subida' => 'datetime',
    ];

    /**
     * Define la relación BelongsTo con el modelo Proyecto (un plano pertenece a un proyecto).
     * Esta es la función que se usa con with('proyecto').
     */
    public function proyecto(): BelongsTo
    {
        // Se asume que la clave foránea en planos_bim es 'proyecto_id'
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Relación con el usuario que subió el plano (opcional)
     */
    public function autor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
}
