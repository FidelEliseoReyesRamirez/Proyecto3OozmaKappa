<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;

    protected $table = 'proyectos'; 

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'cliente_id',
        'responsable_id',
        'eliminado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function planos()
    {
        return $this->hasMany(PlanoBim::class, 'proyecto_id');
    }
    
    public function hitos()
    {
        return $this->hasMany(\App\Models\Hitos::class, 'proyecto_id');
    }


    public function users()
    {
        return $this->belongsToMany(User::class, 'proyectos_usuarios', 'proyecto_id', 'user_id')
            ->withPivot('rol_en_proyecto', 'eliminado')
            ->wherePivot('eliminado', 0);
    }

    public function meetings()
    {
        return $this->hasMany(Meeting::class, 'proyecto_id')
            ->where('eliminado', 0);
    }

    public function documentos() 
    {
        return $this->hasMany(Documento::class, 'proyecto_id')->orderBy('created_at');
    }
}