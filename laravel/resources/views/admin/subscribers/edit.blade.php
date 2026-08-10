<x-admin-layout>
    <x-slot name="title">Edit Subscriber</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.subscribers.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Subscribers</a>
    </div>

    <x-admin.page-header title="Edit Subscriber" description="Update subscriber details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.subscribers.update', $subscriber) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.subscribers._form', ['subscriber' => $subscriber])
            </form>
        </div>
    </div>
</x-admin-layout>