<x-admin-layout>
    <x-slot name="title">Edit Blog Category</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.blog-categories.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Categories</a>
    </div>

    <x-admin.page-header title="Edit Category: {{ $blogCategory->name }}" description="Update category details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.blog-categories.update', $blogCategory) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.blog-categories._form', ['category' => $blogCategory])
            </form>
        </div>
    </div>
</x-admin-layout>
