@component('mail::message')
# {{ $notificacion->asunto }}

{{ $notificacion->mensaje }}

@isset($notificacion->url)
@component('mail::button', ['url' => $notificacion->url])
Ver detalle
@endcomponent
@endisset

Gracias, DevelArq

@endcomponent
