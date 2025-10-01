@component('mail::message')
# ¡Hola!

Por favor, haz clic en el siguiente botón para verificar tu dirección de correo electrónico.

@component('mail::button', ['url' => $url, 'color' => 'primary'])
Verificar Dirección de Email
@endcomponent

Si no creaste esta cuenta, no se requiere ninguna otra acción.

Saludos,
DEVELARQ | BIM Management Office

@component('mail::subcopy')
Si tienes problemas al hacer clic en el botón "Verificar Dirección de Email", copia y pega la siguiente URL en tu navegador web: 
<span class="break-all">[{{ $url }}]({{ $url }})</span>
@endcomponent
@endcomponent