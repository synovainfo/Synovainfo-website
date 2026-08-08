<x-admin-layout>
    <x-slot name="title">Create User</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.users.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Users</a>
    </div>

    <x-admin.page-header title="Create User" description="Add a new administrator or team member." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.users.store') }}" method="POST">
                @csrf
                @include('admin.users._form')
            </form>
        </div>
    </div>
</x-admin-layout>
