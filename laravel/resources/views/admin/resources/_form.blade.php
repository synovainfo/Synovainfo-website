<div class="space-y-6">
    <div>
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" required value="{{ old('title', $resource->title ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" required value="{{ old('slug', $resource->slug ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description</label>
        <div class="mt-2">
            <textarea name="description" id="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('description', $resource->description ?? '') }}</textarea>
        </div>
        @error('description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="type" class="block text-sm font-medium leading-6 text-slate-900">Type</label>
            <div class="mt-2">
                <input type="text" name="type" id="type" value="{{ old('type', $resource->type ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('type') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
        
        <div>
            <label for="category" class="block text-sm font-medium leading-6 text-slate-900">Category</label>
            <div class="mt-2">
                <input type="text" name="category" id="category" value="{{ old('category', $resource->category ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('category') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div>
        <label for="file_url" class="block text-sm font-medium leading-6 text-slate-900">File URL</label>
        <div class="mt-2 flex rounded-md shadow-sm">
            <input type="url" name="file_url" id="file_url" value="{{ old('file_url', $resource->file_url ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('file_url') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
    
    <div>
        <label for="cover_image" class="block text-sm font-medium leading-6 text-slate-900">Cover Image URL</label>
        <div class="mt-2 flex rounded-md shadow-sm">
            <input type="url" name="cover_image" id="cover_image" value="{{ old('cover_image', $resource->cover_image ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('cover_image') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <select name="status" id="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('status', $resource->status ?? true) ? 'selected' : '' }}>Active</option>
                <option value="0" {{ old('status', $resource->status ?? true) ? '' : 'selected' }}>Inactive</option>
            </select>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 border-t border-slate-200 pt-5 flex justify-end gap-3">
    <a href="{{ route('admin.resources.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Cancel</a>
    <button type="submit" class="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
        {{ $resource ? 'Update Resource' : 'Create Resource' }}
    </button>
</div>
