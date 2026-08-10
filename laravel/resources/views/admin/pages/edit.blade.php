<x-admin-layout>
    <x-slot name="title">Edit Page: {{ $page->title }}</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.pages.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Pages</a>
    </div>

    <x-admin.page-header title="Edit Page" description="Update the content and settings for '{{ $page->title }}'." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.pages.update', $page) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.pages._form', ['page' => $page, 'pageContent' => $pageContent])
            </form>
        </div>
    </div>
</x-admin-layout>