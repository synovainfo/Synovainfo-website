<x-admin-layout>
    <x-slot name="title">Blog Categories</x-slot>

    <x-admin.page-header title="Blog Categories" description="Manage article categories and taxonomies.">
        <a href="{{ route('admin.blog-categories.create') }}" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">
            Add Category
        </a>
    </x-admin.page-header>

    <!-- Search/Filter -->
    <div class="bg-white shadow sm:rounded-lg mb-6 border border-slate-200">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.blog-categories.index') }}" method="GET" class="flex gap-4">
                <div class="w-full max-w-sm">
                    <input type="text" name="search" id="search" value="{{ request('search') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-600 sm:text-sm" placeholder="Search categories...">
                </div>
                <button type="submit" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Search</button>
                @if(request('search'))
                    <a href="{{ route('admin.blog-categories.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Clear</a>
                @endif
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
                                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Name</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Slug</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Posts Count</th>
                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 bg-white">
                            @forelse($categories as $category)
                                <tr>
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                        {{ $category->name }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        {{ $category->slug }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                        <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{{ $category->posts_count ?? 0 }}</span>
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href="{{ route('admin.blog-categories.edit', $category) }}" class="text-orange-600 hover:text-orange-900 mr-4">Edit</a>
                                        <form action="{{ route('admin.blog-categories.destroy', $category) }}" method="POST" class="inline-block" onsubmit="return confirm('Delete this category?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="px-3 py-8 text-center text-sm text-slate-500">No categories found.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="mt-4">
                    {{ $categories->withQueryString()->links() }}
                </div>
            </div>
        </div>
    </div>
</x-admin-layout>
