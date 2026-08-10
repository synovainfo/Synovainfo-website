<x-admin-layout>
    <x-slot name="title">View Lead</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.leads.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Leads</a>
    </div>

    <x-admin.page-header title="Lead Details: {{ $lead->first_name }} {{ $lead->last_name }}" description="View lead submission details and manage status." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 p-6 max-w-4xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ $lead->first_name }} {{ $lead->last_name }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</dt>
                <dd class="mt-1 text-sm text-slate-900"><a href="mailto:{{ $lead->email }}" class="text-orange-600 hover:underline">{{ $lead->email }}</a></dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Company</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $lead->company ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $lead->phone ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Service Requested</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $lead->service ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted At</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $lead->created_at->format('F d, Y H:i A') }}</dd>
            </div>
            
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">IP Address</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $lead->ip_address ?? 'Not captured' }}</dd>
            </div>

            <div class="col-span-full">
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Message / Inquiry</dt>
                <dd class="mt-2 text-sm text-slate-800 bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap">{{ $lead->message ?? 'No message provided.' }}</dd>
            </div>
        </div>

        <div class="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
            <form action="{{ route('admin.leads.update', $lead) }}" method="POST" class="flex items-center gap-3">
                @csrf
                @method('PUT')
                <label for="status" class="text-sm font-semibold text-slate-700">Status:</label>
                <select name="status" id="status" class="rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 sm:text-sm">
                    <option value="new" {{ $lead->status === 'new' ? 'selected' : '' }}>New</option>
                    <option value="contacted" {{ $lead->status === 'contacted' ? 'selected' : '' }}>Contacted</option>
                    <option value="qualified" {{ $lead->status === 'qualified' ? 'selected' : '' }}>Qualified</option>
                    <option value="closed" {{ $lead->status === 'closed' ? 'selected' : '' }}>Closed</option>
                </select>
                <button type="submit" class="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Update Status</button>
            </form>

            <form action="{{ route('admin.leads.destroy', $lead) }}" method="POST" onsubmit="return confirm('Delete this lead?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm font-semibold text-red-600 hover:text-red-800">Delete Lead</button>
            </form>
        </div>
    </div>
</x-admin-layout>
