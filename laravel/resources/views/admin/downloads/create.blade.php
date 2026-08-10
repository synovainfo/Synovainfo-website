<x-admin-layout>
    <x-slot name="title">Create Download</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.downloads.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Downloads</a>
    </div>

    <x-admin.page-header title="Create New Download" description="Add a new downloadable file." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.downloads.store') }}" method="POST">
                @csrf
                @include('admin.downloads._form', ['download' => null])
            </form>
        </div>
    </div>
</x-admin-layout>
