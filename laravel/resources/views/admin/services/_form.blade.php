<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <!-- Title -->
    <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" value="{{ old('title', $service->title ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Slug -->
    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $service->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Category -->
    <div class="sm:col-span-3">
        <label for="category" class="block text-sm font-medium leading-6 text-slate-900">Category</label>
        <div class="mt-2">
            <input type="text" name="category" id="category" value="{{ old('category', $service->category ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('category') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Status -->
    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('status', $service->status ?? 1) == 1 ? 'selected' : '' }}>Active</option>
                <option value="0" {{ old('status', $service->status ?? 1) == 0 ? 'selected' : '' }}>Draft</option>
            </select>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Short Description -->
    <div class="col-span-full">
        <label for="short_description" class="block text-sm font-medium leading-6 text-slate-900">Short Description</label>
        <div class="mt-2">
            <textarea id="short_description" name="short_description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('short_description', $service->short_description ?? '') }}</textarea>
        </div>
        @error('short_description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Full Description -->
    <div class="col-span-full">
        <label for="full_description" class="block text-sm font-medium leading-6 text-slate-900">Full Description</label>
        <div class="mt-2">
            <textarea id="full_description" name="full_description" rows="6" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('full_description', $service->full_description ?? '') }}</textarea>
        </div>
        @error('full_description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Benefits (Alpine Array Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Benefits</label>
        <div x-data="{ items: {{ json_encode(old('benefits', $service->benefits ?? [''])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-2 mt-2">
                    <input type="text" x-model="items[index]" :name="'benefits[' + index + ']'" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push('')" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Benefit</button>
        </div>
    </div>

    <!-- SEO Information -->
    <div class="col-span-full mt-4">
        <h3 class="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">SEO Settings</h3>
    </div>

    <!-- SEO Title -->
    <div class="sm:col-span-3">
        <label for="seo_title" class="block text-sm font-medium leading-6 text-slate-900">SEO Title</label>
        <div class="mt-2">
            <input type="text" name="seo_title" id="seo_title" value="{{ old('seo_title', $service->seo_title ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- SEO Description -->
    <div class="col-span-full">
        <label for="seo_description" class="block text-sm font-medium leading-6 text-slate-900">SEO Description</label>
        <div class="mt-2">
            <textarea id="seo_description" name="seo_description" rows="2" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('seo_description', $service->seo_description ?? '') }}</textarea>
        </div>
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.services.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save Service</button>
</div>
