@props(['active' => false])

@php
$classes = $active
            ? 'bg-slate-800 text-white group flex items-center rounded-md px-3 py-2 text-sm font-medium'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white group flex items-center rounded-md px-3 py-2 text-sm font-medium';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
