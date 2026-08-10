<x-admin-layout>
    <x-slot name="title">Edit Form</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.forms.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Forms</a>
    </div>

    <x-admin.page-header title="Edit Form" description="Update form configuration." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.forms.update', $form) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.forms._form', ['form' => $form])
            </form>
        </div>
    </div>
</x-admin-layout>
