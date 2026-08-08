<x-admin-layout>
    <x-slot name="title">Create Career</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.careers.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Careers</a>
    </div>

    <x-admin.page-header title="Create Career" description="Add a new open position." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.careers.store') }}" method="POST">
                @csrf
                @include('admin.careers._form')
            </form>
        </div>
    </div>
</x-admin-layout>
