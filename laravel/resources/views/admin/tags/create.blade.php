<x-admin-layout>
    <x-slot name="title">Create Tag</x-slot>

    <x-admin.page-header title="Create Tag">
        <a href="{{ route('admin.tags.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Tags
        </a>
    </x-admin.page-header>

    <form action="{{ route('admin.tags.store') }}" method="POST" class="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2 mt-6">
        @csrf
        <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name</label>
                            <div class="mt-2">
                                <input type="text" name="name" id="name" value="{{ old('name', $tag->name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('name')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug</label>
                            <div class="mt-2">
                                <input type="text" name="slug" id="slug" value="{{ old('slug', $tag->slug ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('slug')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

            </div>
        </div>
        <div class="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8">
            <a href="{{ route('admin.tags.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
            <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save</button>
        </div>
    </form>
</x-admin-layout>