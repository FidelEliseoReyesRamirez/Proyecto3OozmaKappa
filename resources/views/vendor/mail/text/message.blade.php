<x-mail::layout>
    {{-- Header --}}
    <x-slot:header>
        {{-- **CAMBIO 1: Reemplazar el nombre de la App en el encabezado** --}}
        <x-mail::header :url="config('app.url')">
            DEVELARQ | BIM Management Office
        </x-mail::header>
    </x-slot:header>

    {{-- Body --}}
    {{ $slot }}

    {{-- Subcopy --}}
    @isset($subcopy)
        <x-slot:subcopy>
            <x-mail::subcopy>
                {{ $subcopy }}
            </x-mail::subcopy>
        </x-slot:subcopy>
    @endisset

    {{-- Footer --}}
    <x-slot:footer>
        <x-mail::footer>
            {{-- **CAMBIO 2: Pie de página con tu marca y traducción al español** --}}
            © {{ date('Y') }} DEVELARQ | BIM Management Office. @lang('Todos los derechos reservados.')
        </x-mail::footer>
    </x-slot:footer>
</x-mail::layout>