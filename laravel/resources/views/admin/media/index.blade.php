<x-admin-layout>
    <x-slot name="title">Media Library</x-slot>

    <div x-data="{ uploadOpen: false, copyNotice: false }">
        <x-admin.page-header title="Media Library" description="Upload and manage assets, logos, and images.">
            <x-slot name="actions">
                <button type="button" @click="uploadOpen = true" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">
                    <svg class="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload Media
                </button>
            </x-slot>
        </x-admin.page-header>

        <!-- Search / Filter bar -->
        <div class="bg-white shadow sm:rounded-lg mb-6 border border-slate-200">
            <div class="px-4 py-5 sm:p-6">
                <form action="{{ route('admin.media.index') }}" method="GET" class="flex flex-wrap gap-4 items-center">
                    <div class="w-full max-w-xs">
                        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search file name..." class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-600 sm:text-sm">
                    </div>
                    <div>
                        <select name="mime" class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm">
                            <option value="">All Types</option>
                            <option value="image" {{ request('mime') == 'image' ? 'selected' : '' }}>Images</option>
                            <option value="application/pdf" {{ request('mime') == 'application/pdf' ? 'selected' : '' }}>PDFs</option>
                        </select>
                    </div>
                    <button type="submit" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Filter</button>
                    @if(request('search') || request('mime'))
                        <a href="{{ route('admin.media.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Clear</a>
                    @endif
                </form>
            </div>
        </div>

        <!-- Notification banner for copying -->
        <div x-show="copyNotice" x-transition.duration.300ms class="mb-4 rounded-md bg-green-50 p-4 border border-green-200" style="display: none;">
            <div class="flex">
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">Media URL copied to clipboard!</p>
                </div>
            </div>
        </div>

        <!-- Media Grid -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            @forelse($mediaItems as $media)
                <div class="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-white shadow border border-slate-200 hover:shadow-md transition">
                    <div class="aspect-square w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        @if(str_starts_with($media->mime_type, 'image/'))
                            <img src="{{ $media->url }}" alt="{{ $media->alt_text ?? $media->name }}" class="h-full w-full object-cover group-hover:scale-105 transition duration-300">
                        @else
                            <div class="flex flex-col items-center justify-center p-4 text-slate-400">
                                <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <span class="text-xs uppercase font-mono mt-1">{{ pathinfo($media->file_name, PATHINFO_EXTENSION) }}</span>
                            </div>
                        @endif
                    </div>
                    <div class="p-3 bg-white">
                        <p class="text-xs font-semibold text-slate-900 truncate" title="{{ $media->file_name }}">{{ $media->name }}</p>
                        <p class="text-[10px] text-slate-400 mt-0.5">{{ number_format($media->size / 1024, 1) }} KB</p>
                        
                        <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                            <button type="button" @click="navigator.clipboard.writeText('{{ $media->url }}'); copyNotice = true; setTimeout(() => copyNotice = false, 2500)" class="text-xs text-orange-600 font-medium hover:underline">Copy URL</button>

                            <form action="{{ route('admin.media.destroy', $media) }}" method="POST" onsubmit="return confirm('Delete this media file?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-xs text-red-600 hover:underline">Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full py-12 text-center bg-white rounded-lg border border-slate-200">
                    <svg class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p class="mt-2 text-sm text-slate-500">No media files uploaded yet.</p>
                </div>
            @endforelse
        </div>

        <div class="mt-6">
            {{ $mediaItems->withQueryString()->links() }}
        </div>

        <!-- Upload Modal -->
        <div x-show="uploadOpen" class="relative z-50" style="display: none;">
            <div class="fixed inset-0 bg-slate-500/75 transition-opacity"></div>
            <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                <div class="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 class="text-base font-semibold text-slate-900">Upload New File</h3>
                        <button type="button" @click="uploadOpen = false" class="text-slate-400 hover:text-slate-500">&times;</button>
                    </div>
                    <form action="{{ route('admin.media.store') }}" method="POST" enctype="multipart/form-data" class="mt-4 space-y-4">
                        @csrf
                        <div>
                            <label class="block text-sm font-medium text-slate-900">File</label>
                            <input type="file" name="file" required class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-900">Alt Text</label>
                            <input type="text" name="alt_text" placeholder="Descriptive text for accessibility" class="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-900">Collection</label>
                            <input type="text" name="collection" value="default" class="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 text-sm">
                        </div>
                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" @click="uploadOpen = false" class="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                            <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-admin-layout>
