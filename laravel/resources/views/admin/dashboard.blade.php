<x-admin-layout>
    <x-slot name="title">Dashboard</x-slot>

    <x-admin.page-header title="Dashboard" description="Overview of system activity and key metrics." />

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <!-- Stat Cards -->
        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">Total Pages</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['pages_count'] }}</p>
            </dd>
        </div>

        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">Total Leads</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['leads_count'] }}</p>
            </dd>
        </div>

        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">New Leads (7d)</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['new_leads_this_week'] }}</p>
            </dd>
        </div>
        
        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">System Users</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['users_count'] }}</p>
            </dd>
        </div>

        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">Services</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['services_count'] ?? 0 }}</p>
            </dd>
        </div>

        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">Published Case Studies</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['case_studies_count'] ?? 0 }}</p>
            </dd>
        </div>

        <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-slate-200">
            <dt>
                <div class="absolute rounded-md bg-orange-500 p-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <p class="ml-16 truncate text-sm font-medium text-slate-500">Open Careers</p>
            </dt>
            <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p class="text-2xl font-semibold text-slate-900">{{ $stats['careers_count'] ?? 0 }}</p>
            </dd>
        </div>
    </div>

    <!-- Recent Activity & Leads -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Recent Leads -->
        <div class="bg-white rounded-lg shadow border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 class="text-base font-semibold leading-6 text-slate-900">Recent Leads</h3>
                <a href="{{ route('admin.leads.index') }}" class="text-sm font-semibold text-orange-600 hover:text-orange-500">View all</a>
            </div>
            <div class="divide-y divide-slate-200">
                @forelse($recentLeads as $lead)
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-slate-900 truncate">{{ $lead->first_name }} {{ $lead->last_name }}</p>
                            <div class="ml-2 flex flex-shrink-0">
                                <p class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">{{ $lead->status }}</p>
                            </div>
                        </div>
                        <div class="mt-2 sm:flex sm:justify-between">
                            <div class="sm:flex">
                                <p class="flex items-center text-sm text-slate-500">
                                    {{ $lead->company }} &bull; {{ $lead->email }}
                                </p>
                            </div>
                            <div class="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                                <svg class="mr-1.5 h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M5.75 2a.75.75 0 011.5 0v1.5h5.5V2a.75.75 0 011.5 0v1.5h5.625c.621 0 1.125.504 1.125 1.125v15.25c0 .621-.504 1.125-1.125 1.125h-15.25c-.621 0-1.125-.504-1.125-1.125V4.625c0-.621.504-1.125 1.125-1.125H5.75V2zm-4.625 3.375h15.25v1.5H1.125v-1.5zm15.25 3h-15.25v10.5h15.25v-10.5z" clip-rule="evenodd" />
                                </svg>
                                <p>{{ $lead->created_at->diffForHumans() }}</p>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="p-6 text-center text-sm text-slate-500">No recent leads.</div>
                @endforelse
            </div>
        </div>

        <!-- System Audit Log -->
        <div class="bg-white rounded-lg shadow border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 class="text-base font-semibold leading-6 text-slate-900">System Audit Log</h3>
            </div>
            <div class="divide-y divide-slate-200">
                @forelse($recentLogs as $log)
                    <div class="p-6">
                        <div class="flex space-x-3">
                            <div class="flex-1 space-y-1">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-sm font-medium text-slate-900">{{ $log->user->name ?? 'System' }}</h3>
                                    <p class="text-sm text-slate-500">{{ $log->created_at->diffForHumans() }}</p>
                                </div>
                                <p class="text-sm text-slate-500">{{ $log->action }} on {{ class_basename($log->auditable_type) }} #{{ $log->auditable_id }}</p>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="p-6 text-center text-sm text-slate-500">No recent audit logs.</div>
                @endforelse
            </div>
        </div>

    </div>
</x-admin-layout>
