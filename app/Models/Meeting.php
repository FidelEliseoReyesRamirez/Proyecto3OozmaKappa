<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $table = 'reuniones'; 
    
    protected $casts = [
        'fecha_hora' => 'datetime', 
    ];

    protected $fillable = [
        'proyecto_id', 
        'titulo', 
        'descripcion', 
        'fecha_hora',
        'creador_id', 
        'eliminado',
    ];
    public function users()
    {
        return $this->belongsToMany(
            User::class, 
            'reuniones_usuarios', 
            'reunion_id',         
            'user_id'             
        );
    }
    
    /**
     * Relationship: Meeting belongs to Project (Proyecto).
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'proyecto_id', 'id');
    }
}