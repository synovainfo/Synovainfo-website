<x-admin-layout>
    <x-slot name="title">Edit Career</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.careers.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Careers</a>
    </div>

    <x-admin.page-header title="Edit Career: {{ $career->title }}" description="Update the details of this position." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.careers.update', $career) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.careers._form', ['career' => $career])
            </form>
        </div>
    </div>
</x-admin-layout>
