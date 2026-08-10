<x-admin-layout>
    <x-slot name="title">Create Resource</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.resources.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Resources</a>
    </div>

    <x-admin.page-header title="Create New Resource" description="Add a new downloadable resource." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.resources.store') }}" method="POST">
                @csrf
                @include('admin.resources._form', ['resource' => null])
            </form>
        </div>
    </div>
</x-admin-layout>
