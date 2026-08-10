<x-admin-layout>
    <x-slot name="title">View Newsletter</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.newsletters.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Newsletters</a>
    </div>

    <x-admin.page-header title="Newsletter: {{ $newsletter->subject }}" description="View newsletter details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 p-6 max-w-4xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Subject</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ $newsletter->subject }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ ucfirst($newsletter->status) }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Sent At</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $newsletter->sent_at ? $newsletter->sent_at->format('F d, Y H:i A') : 'Not sent' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Recipients Count</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $newsletter->recipient_count }}</dd>
            </div>

            <div class="col-span-full">
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Content Body</dt>
                <dd class="mt-2 text-sm text-slate-800 bg-slate-50 p-4 rounded-md border border-slate-200 prose max-w-none">
                    {!! nl2br(e($newsletter->body)) !!}
                </dd>
            </div>
        </div>

        <div class="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
            <form action="{{ route('admin.newsletters.destroy', $newsletter) }}" method="POST" onsubmit="return confirm('Delete this newsletter?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm font-semibold text-red-600 hover:text-red-800">Delete Newsletter</button>
            </form>
        </div>
    </div>
</x-admin-layout>