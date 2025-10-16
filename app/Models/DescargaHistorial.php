<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DescargaHistorial extends Model
{
    use HasFactory;
    
    protected $table = 'descargas_historial';

    protected $fillable = [
        'user_id',
        'documento_id',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documento()
    {
        return $this->belongsTo(Documento::class);
    }
}
