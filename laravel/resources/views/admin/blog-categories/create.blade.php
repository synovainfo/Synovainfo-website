<x-admin-layout>
    <x-slot name="title">Create Blog Category</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.blog-categories.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Categories</a>
    </div>

    <x-admin.page-header title="Create Category" description="Add a new blog category." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.blog-categories.store') }}" method="POST">
                @csrf
                @include('admin.blog-categories._form')
            </form>
        </div>
    </div>
</x-admin-layout>
