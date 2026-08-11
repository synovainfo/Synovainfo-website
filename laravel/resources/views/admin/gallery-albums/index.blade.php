<x-admin-layout>
    <x-slot name="title">Gallery Albums</x-slot>

    <x-admin.page-header title="Gallery Albums" description="Manage Gallery Albums.">
        <a href="{{ route('admin.gallery-albums.create') }}" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
            Create Gallery Album
        </a>
    </x-admin.page-header>

    <div class="bg-white shadow sm:rounded-lg mb-6 border border-slate-200">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.gallery-albums.index') }}" method="GET" class="flex gap-4">
                <div class="w-full max-w-sm">
                    <input type="text" name="search" value="{{ request('search') }}" class="block w-full rounded-md border-0 py-1.5 pl-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="Search...">
                </div>
                <button type="submit" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Search</button>
            </form>
        </div>
    </div>

    <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-slate-200">
                    <table class="min-w-full divide-y divide-slate-300">
                        <thead class="bg-slate-50">
                            <tr>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Name</th>
<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Slug</th>
<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Description</th>

                                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200 bg-white">
                            @forelse($galleryAlbums as $galleryAlbum)
                                <tr>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{{ $galleryAlbum->name }}</td>
<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{{ $galleryAlbum->slug }}</td>
<td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{{ $galleryAlbum->description }}</td>

                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href="{{ route('admin.gallery-albums.show', $galleryAlbum) }}" class="text-blue-600 hover:text-blue-900 mr-4">View</a>
                                        <a href="{{ route('admin.gallery-albums.edit', $galleryAlbum) }}" class="text-orange-600 hover:text-orange-900 mr-4">Edit</a>
                                        <form action="{{ route('admin.gallery-albums.destroy', $galleryAlbum) }}" method="POST" class="inline-block" onsubmit="return confirm('Are you sure?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="100%" class="px-3 py-8 text-center text-sm text-slate-500">No records found.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="mt-4">
                    {{ $galleryAlbums->withQueryString()->links() }}
                </div>
            </div>
        </div>
    </div>
</x-admin-layout>
