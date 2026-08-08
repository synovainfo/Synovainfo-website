<x-admin-layout>
    <x-slot name="title">Edit Service</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.services.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Services</a>
    </div>

    <x-admin.page-header title="Edit Service: {{ $service->title }}" description="Update the details of this service." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.services.update', $service) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.services._form', ['service' => $service])
            </form>
        </div>
    </div>
</x-admin-layout>
