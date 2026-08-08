<x-admin-layout>
    <x-slot name="title">Edit Blog Post</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.blog-posts.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Posts</a>
    </div>

    <x-admin.page-header title="Edit Article: {{ $blogPost->title }}" description="Update article details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.blog-posts.update', $blogPost) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.blog-posts._form', ['post' => $blogPost])
            </form>
        </div>
    </div>
</x-admin-layout>
