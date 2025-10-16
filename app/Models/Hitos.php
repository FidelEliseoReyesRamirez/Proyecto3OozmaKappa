<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Documento;

class Hitos extends Model
{
    use HasFactory;
    
    protected $table = 'hitos';

    protected $fillable = [
        'proyecto_id', 
        'nombre', 
        'fecha_hito', 
        'descripcion', 
        'estado', 
        'encargado_id',
        'documento_id',
    ];

    protected $casts = [
        'fecha_hito' => 'date',
    ];

    /**
     * Relación: Encargado del hito.
     */
    public function encargado()
    {
        return $this->belongsTo(User::class, 'encargado_id');
    }

    /**
     * Relación: Documento adjunto al hito.
     */
    public function documento()
    {
        return $this->belongsTo(Documento::class, 'documento_id');
    }
}