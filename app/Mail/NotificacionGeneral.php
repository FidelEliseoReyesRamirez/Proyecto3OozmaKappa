<?php

namespace App\Mail;

use App\Models\Notificacion;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionGeneral extends Mailable
{
    use SerializesModels;

    public $notificacion;

    public function __construct(Notificacion $notificacion)
    {
        $this->notificacion = $notificacion;
    }

    public function build()
    {
        return $this->subject($this->notificacion->asunto ?? 'Nueva notificación')
                    ->markdown('emails.notificacion');
    }
}
