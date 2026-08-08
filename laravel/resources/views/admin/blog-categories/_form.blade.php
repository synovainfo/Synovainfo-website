<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <div class="sm:col-span-4">
        <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="name" id="name" value="{{ old('name', $category->name ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
        @error('name') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $category->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="col-span-full">
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description</label>
        <div class="mt-2">
            <textarea id="description" name="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">{{ old('description', $category->description ?? '') }}</textarea>
        </div>
        @error('description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.blog-categories.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Save Category</button>
</div>
