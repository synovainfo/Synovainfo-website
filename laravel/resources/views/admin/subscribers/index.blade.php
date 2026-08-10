<x-admin-layout>
    <x-slot name="title">Subscribers</x-slot>

    <x-admin.page-header title="Subscribers" description="Manage Newsletter Subscribers.">
        <x-slot name="actions">
            <a href="{{ route('admin.subscribers.create') }}" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">
                New Subscriber
            </a>
        </x-slot>
    </x-admin.page-header>

    <!-- Search/Filter -->
    <div class="bg-white shadow sm:rounded-lg mb-6 border border-slate-200">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.subscribers.index') }}" method="GET" class="flex gap-4">
                <div class="w-full max-w-sm">
                    <label for="search" class="sr-only">Search</label>
                    <div class="relative rounded-md shadow-sm">
                        <input type="text" name="search" id="search" value="{{ request('search') }}" class="block w-full rounded-md border-0 py-1.5 pl-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="Search subscribers...">
                    </div>
                </div>
                <button type="submit" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Search</button>
            </form>
        </div>
    </div>

    <!-- Data Table -->
    <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-slate-200">
                    <table class="min-w-full divide-y divide-slate-300">
                        <thead class="bg-slate-50">
                            <tr>
                                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Email</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Name</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Subscribed At</th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 bg-white" id="subscribers-table-body">
                            @forelse($subscribers as $subscriber)
                                <tr>
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                        {{ $subscriber->email }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {{ $subscriber->name ?? '-' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        @if($subscriber->status === 'subscribed')
                                            <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Subscribed</span>
                                        @else
                                            <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Unsubscribed</span>
                                        @endif
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {{ $subscriber->subscribed_at ? $subscriber->subscribed_at->format('M d, Y H:i') : '-' }}
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href="{{ route('admin.subscribers.show', $subscriber) }}" class="text-orange-600 hover:text-orange-900 mr-3">View</a>
                                        <a href="{{ route('admin.subscribers.edit', $subscriber) }}" class="text-orange-600 hover:text-orange-900">Edit</a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-3 py-8 text-center text-sm text-slate-500">
                                        No subscribers found.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="mt-4">
                    {{ $subscribers->withQueryString()->links() }}
                </div>
            </div>
        </div>
    </div>

    <x-admin.auto-refresh targetId="subscribers-table-body" interval="15" />
</x-admin-layout>