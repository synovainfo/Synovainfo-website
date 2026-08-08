<x-admin-layout>
    <x-slot name="title">Create Portfolio Project</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.portfolios.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Portfolio</a>
    </div>

    <x-admin.page-header title="Create Project" description="Add a new client showcase project." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.portfolios.store') }}" method="POST">
                @csrf
                @include('admin.portfolios._form')
            </form>
        </div>
    </div>
</x-admin-layout>
