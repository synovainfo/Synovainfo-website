@php
    $pageContent = $pageContent ?? '';
@endphp

<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" value="{{ old('title', $page->title ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2 flex rounded-md shadow-sm">
            <span class="inline-flex items-center rounded-l-md border border-r-0 border-slate-300 px-3 text-slate-500 sm:text-sm">/</span>
            <input type="text" name="slug" id="slug" value="{{ old('slug', $page->slug ?? '') }}" required class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="about-us">
        </div>
        <p class="mt-2 text-sm text-slate-500">The URL path for this page. Use '/' for the home page.</p>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:max-w-xs sm:text-sm sm:leading-6">
                @foreach(\App\Enums\PageStatus::cases() as $status)
                    <option value="{{ $status->value }}" {{ old('status', isset($page) ? $page->status->value : \App\Enums\PageStatus::DRAFT->value) === $status->value ? 'selected' : '' }}>{{ ucfirst(strtolower($status->value)) }}</option>
                @endforeach
            </select>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-3">
        <label for="published_at" class="block text-sm font-medium leading-6 text-slate-900">Publish Date</label>
        <div class="mt-2">
            <input type="datetime-local" name="published_at" id="published_at" value="{{ old('published_at', isset($page) && $page->published_at ? $page->published_at->format('Y-m-d\TH:i') : now()->format('Y-m-d\TH:i')) }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('published_at') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="col-span-full">
        <label for="excerpt" class="block text-sm font-medium leading-6 text-slate-900">Excerpt / Meta Description</label>
        <div class="mt-2">
            <textarea id="excerpt" name="excerpt" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('excerpt', $page->excerpt ?? '') }}</textarea>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-600">Write a brief summary used for SEO and previews.</p>
        @error('excerpt') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <x-admin.rich-text-editor
        name="content"
        id="page-content"
        label="Page Body"
        :value="$pageContent"
        help="Use headings, lists, links, images, quotes, and tables to build editable CMS page content."
    />

    <div class="sm:col-span-3">
        <label for="template" class="block text-sm font-medium leading-6 text-slate-900">Blade Template</label>
        <div class="mt-2">
            <input type="text" name="template" id="template" value="{{ old('template', $page->template ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="pages.default">
        </div>
        <p class="mt-2 text-sm text-slate-500">Optional. The blade view to render this page.</p>
        @error('template') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.pages.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save Page</button>
</div>
