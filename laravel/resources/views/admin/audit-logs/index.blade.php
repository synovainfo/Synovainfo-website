<x-admin-layout>
    <x-slot name="title">Audit Logs</x-slot>

    <x-admin.page-header title="Audit Logs" description="View system security and audit activities." />

    <!-- Data Table -->
    <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-slate-200">
                    <table class="min-w-full divide-y divide-slate-300">
                        <thead class="bg-slate-50">
                            <tr>
                                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Timestamp</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">User</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Action</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Resource</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">IP Address</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 bg-white" id="audit-logs-table-body">
                            @forelse($logs as $log)
                                <tr>
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-900 sm:pl-6">
                                        {{ $log->created_at ? $log->created_at->format('Y-m-d H:i:s') : '-' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {{ $log->user->name ?? 'System' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{{ $log->action }}</span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {{ $log->resource ?? '-' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {{ $log->ip_address ?? '-' }}
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-3 py-8 text-center text-sm text-slate-500">
                                        No audit logs recorded yet.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="mt-4">
                    {{ $logs->links() }}
                </div>
            </div>
        </div>
    </div>

    <x-admin.auto-refresh targetId="audit-logs-table-body" interval="15" />
</x-admin-layout>
