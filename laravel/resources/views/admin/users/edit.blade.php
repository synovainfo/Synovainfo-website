<x-admin-layout>
    <x-slot name="title">Edit User</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.users.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Users</a>
    </div>

    <x-admin.page-header title="Edit User: {{ $user->name }}" description="Update details and permissions for this user." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.users.update', $user) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.users._form', ['user' => $user])
            </form>
        </div>
    </div>
</x-admin-layout>
