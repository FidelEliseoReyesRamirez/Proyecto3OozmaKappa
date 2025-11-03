<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Proyecto;
use App\Models\User; // Asegúrate de tener esta línea si tu modelo User está aquí

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

    protected $casts = [
        'eliminado' => 'boolean',
        'fecha_subida' => 'datetime',
    ];

    /**
     * Define la relación BelongsTo con el modelo Proyecto.
     * Nombre: 'proyecto' (coincidiendo con tu preferencia).
     */
    public function proyecto(): BelongsTo 
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id');
    }

    /**
     * Relación con el usuario que subió el plano.
     * ⭐ CORRECCIÓN: Renombrado a 'uploader' para coincidir con el controlador.
     */
    public function uploader(): BelongsTo 
    {
        // Se asume que la clave foránea en planos_bim es 'subido_por'
        return $this->belongsTo(User::class, 'subido_por');
    }
}