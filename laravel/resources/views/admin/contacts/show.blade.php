<x-admin-layout>
    <x-slot name="title">View Contact</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.contacts.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Contacts</a>
    </div>

    <x-admin.page-header title="Contact Details: {{ $contact->name }}" description="View contact submission details." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 p-6 max-w-4xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ $contact->name }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $contact->email }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Company</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $contact->company ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $contact->phone ?? 'N/A' }}</dd>
            </div>
            
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">IP Address</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $contact->ip_address ?? 'Not captured' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted At</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $contact->created_at->format('F d, Y H:i A') }}</dd>
            </div>

            <div class="col-span-full">
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Message / Inquiry</dt>
                <dd class="mt-2 text-sm text-slate-800 bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap">{{ $contact->message ?? 'No message provided.' }}</dd>
            </div>
        </div>

        <div class="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
            <form action="{{ route('admin.contacts.destroy', $contact) }}" method="POST" onsubmit="return confirm('Delete this contact?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm font-semibold text-red-600 hover:text-red-800">Delete Contact</button>
            </form>
        </div>
    </div>
</x-admin-layout>
