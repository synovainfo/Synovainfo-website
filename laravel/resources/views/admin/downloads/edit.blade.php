<x-admin-layout>
    <x-slot name="title">Edit Download</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.downloads.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Downloads</a>
    </div>

    <x-admin.page-header title="Edit Download" description="Update the downloadable file." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.downloads.update', $download) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.downloads._form', ['download' => $download])
            </form>
        </div>
    </div>
</x-admin-layout>
