<x-admin-layout>
    <x-slot name="title">Edit Contact</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.contacts.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Contacts</a>
    </div>

    <x-admin.page-header title="Edit Contact" description="Update contact details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.contacts.update', $contact) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.contacts._form', ['contact' => $contact])
            </form>
        </div>
    </div>
</x-admin-layout>
