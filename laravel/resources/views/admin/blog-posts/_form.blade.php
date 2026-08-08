<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" value="{{ old('title', $post->title ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $post->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-3">
        <label for="category_id" class="block text-sm font-medium leading-6 text-slate-900">Category</label>
        <div class="mt-2">
            <select id="category_id" name="category_id" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
                <option value="">Select Category</option>
                @foreach($categories as $id => $name)
                    <option value="{{ $id }}" {{ old('category_id', $post->category_id ?? '') == $id ? 'selected' : '' }}>{{ $name }}</option>
                @endforeach
            </select>
        </div>
    </div>

    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
                <option value="published" {{ old('status', $post->status ?? 'published') == 'published' ? 'selected' : '' }}>Published</option>
                <option value="draft" {{ old('status', $post->status ?? 'published') == 'draft' ? 'selected' : '' }}>Draft</option>
            </select>
        </div>
    </div>

    <div class="col-span-full">
        <label for="excerpt" class="block text-sm font-medium leading-6 text-slate-900">Excerpt</label>
        <div class="mt-2">
            <textarea id="excerpt" name="excerpt" rows="2" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">{{ old('excerpt', $post->excerpt ?? '') }}</textarea>
        </div>
    </div>

    <div class="col-span-full">
        <label for="content" class="block text-sm font-medium leading-6 text-slate-900">Article Content</label>
        <div class="mt-2">
            <textarea id="content" name="content" rows="8" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">{{ old('content', $post->content ?? '') }}</textarea>
        </div>
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.blog-posts.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Save Article</button>
</div>
