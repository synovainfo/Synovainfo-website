<x-admin-layout>
    <x-slot name="title">Edit Newsletter</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.newsletters.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Newsletters</a>
    </div>

    <x-admin.page-header title="Edit Newsletter" description="Update newsletter content." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.newsletters.update', $newsletter) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.newsletters._form', ['newsletter' => $newsletter])
            </form>
        </div>
    </div>
</x-admin-layout>