<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'descripcion', 'estado', 'fecha_inicio',
        'fecha_fin', 'cliente_id', 'responsable_id'
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
    public function users()
{
    return $this->belongsToMany(User::class, 'proyectos_usuarios', 'proyecto_id', 'user_id')
        ->wherePivot('eliminado', 0);
}

}
