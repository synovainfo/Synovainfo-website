<x-admin-layout>
    <x-slot name="title">Edit Portfolio Project</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.portfolios.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Portfolio</a>
    </div>

    <x-admin.page-header title="Edit Project: {{ $portfolio->title }}" description="Update project showcase details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.portfolios.update', $portfolio) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.portfolios._form', ['portfolio' => $portfolio])
            </form>
        </div>
    </div>
</x-admin-layout>
