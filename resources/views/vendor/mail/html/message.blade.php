<x-mail::layout>
{{-- Header --}}
<x-slot:header>
{{-- **CAMBIO 1: Reemplazar Logo/Nombre de la App en el encabezado (si no lo haces en header.blade.php)** --}}
<x-mail::header :url="config('app.url')">
    DEVELARQ | BIM Management Office
</x-mail::header>
</x-slot:header>

{{-- Body --}}
{!! $slot !!}

{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset

{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
{{-- **CAMBIO 2: Pie de página con tu marca y traducción al español** --}}
© {{ date('Y') }} DEVELARQ | BIM Management Office. {{ __('Todos los derechos reservados.') }}
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>