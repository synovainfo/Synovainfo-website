<x-admin-layout>
    <x-slot name="title">Create Page</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.pages.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Pages</a>
    </div>

    <x-admin.page-header title="Create New Page" description="Add a new editable CMS page." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.pages.store') }}" method="POST">
                @csrf
                @include('admin.pages._form', ['pageContent' => ''])
            </form>
        </div>
    </div>
</x-admin-layout>