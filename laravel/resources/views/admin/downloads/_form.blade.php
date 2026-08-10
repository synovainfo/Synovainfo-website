<div class="space-y-6">
    <div>
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" required value="{{ old('title', $download->title ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description</label>
        <div class="mt-2">
            <textarea name="description" id="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('description', $download->description ?? '') }}</textarea>
        </div>
        @error('description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="file_type" class="block text-sm font-medium leading-6 text-slate-900">File Type (e.g. PDF, EXE)</label>
            <div class="mt-2">
                <input type="text" name="file_type" id="file_type" value="{{ old('file_type', $download->file_type ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('file_type') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
        
        <div>
            <label for="file_size" class="block text-sm font-medium leading-6 text-slate-900">File Size (in bytes)</label>
            <div class="mt-2">
                <input type="number" name="file_size" id="file_size" min="0" value="{{ old('file_size', $download->file_size ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('file_size') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="category" class="block text-sm font-medium leading-6 text-slate-900">Category</label>
            <div class="mt-2">
                <input type="text" name="category" id="category" value="{{ old('category', $download->category ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('category') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
        
        <div>
            <label for="icon" class="block text-sm font-medium leading-6 text-slate-900">Icon (SVG or class)</label>
            <div class="mt-2">
                <input type="text" name="icon" id="icon" value="{{ old('icon', $download->icon ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('icon') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div>
        <label for="file_url" class="block text-sm font-medium leading-6 text-slate-900">File URL <span class="text-red-500">*</span></label>
        <div class="mt-2 flex rounded-md shadow-sm">
            <input type="url" name="file_url" id="file_url" required value="{{ old('file_url', $download->file_url ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('file_url') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="flex items-center gap-4">
        <div class="flex h-6 items-center">
            <input type="checkbox" name="is_featured" id="is_featured" value="1" {{ old('is_featured', $download->is_featured ?? false) ? 'checked' : '' }} class="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600">
        </div>
        <div class="text-sm leading-6">
            <label for="is_featured" class="font-medium text-slate-900">Featured Download</label>
            <p class="text-slate-500">Highlight this download on the main page.</p>
        </div>
    </div>

    <div>
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <select name="status" id="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('status', $download->status ?? true) ? 'selected' : '' }}>Active</option>
                <option value="0" {{ old('status', $download->status ?? true) ? '' : 'selected' }}>Inactive</option>
            </select>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 border-t border-slate-200 pt-5 flex justify-end gap-3">
    <a href="{{ route('admin.downloads.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Cancel</a>
    <button type="submit" class="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
        {{ $download ? 'Update Download' : 'Create Download' }}
    </button>
</div>
