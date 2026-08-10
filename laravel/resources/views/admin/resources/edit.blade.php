<x-admin-layout>
    <x-slot name="title">Edit Resource</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.resources.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Resources</a>
    </div>

    <x-admin.page-header title="Edit Resource" description="Update the downloadable resource." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.resources.update', $resource) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.resources._form', ['resource' => $resource])
            </form>
        </div>
    </div>
</x-admin-layout>
