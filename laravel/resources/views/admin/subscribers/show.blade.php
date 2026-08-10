<x-admin-layout>
    <x-slot name="title">View Subscriber</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.subscribers.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Subscribers</a>
    </div>

    <x-admin.page-header title="Subscriber Details" description="View subscriber information." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 p-6 max-w-4xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ $subscriber->email }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $subscriber->name ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ ucfirst($subscriber->status) }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Source</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $subscriber->source ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Subscribed At</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $subscriber->subscribed_at ? $subscriber->subscribed_at->format('F d, Y H:i A') : 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Unsubscribed At</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $subscriber->unsubscribed_at ? $subscriber->unsubscribed_at->format('F d, Y H:i A') : 'N/A' }}</dd>
            </div>
        </div>

        <div class="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
            <form action="{{ route('admin.subscribers.destroy', $subscriber) }}" method="POST" onsubmit="return confirm('Delete this subscriber?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm font-semibold text-red-600 hover:text-red-800">Delete Subscriber</button>
            </form>
        </div>
    </div>
</x-admin-layout>