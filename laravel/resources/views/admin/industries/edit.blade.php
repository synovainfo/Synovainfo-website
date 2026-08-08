<x-admin-layout>
    <x-slot name="title">Edit Industry</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.industries.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Industries</a>
    </div>

    <x-admin.page-header title="Edit Industry: {{ $industry->name }}" description="Update the details of this industry." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.industries.update', $industry) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.industries._form', ['industry' => $industry])
            </form>
        </div>
    </div>
</x-admin-layout>
