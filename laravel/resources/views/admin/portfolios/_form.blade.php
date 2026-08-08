<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Project Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" value="{{ old('title', $portfolio->title ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $portfolio->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div class="sm:col-span-3">
        <label for="client_name" class="block text-sm font-medium leading-6 text-slate-900">Client Name</label>
        <div class="mt-2">
            <input type="text" name="client_name" id="client_name" value="{{ old('client_name', $portfolio->client_name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
        </div>
    </div>

    <div class="sm:col-span-3">
        <label for="project_url" class="block text-sm font-medium leading-6 text-slate-900">Live Project URL</label>
        <div class="mt-2">
            <input type="url" name="project_url" id="project_url" value="{{ old('project_url', $portfolio->project_url ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm" placeholder="https://example.com">
        </div>
    </div>

    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
                <option value="1" {{ old('status', $portfolio->status ?? 1) == 1 ? 'selected' : '' }}>Published</option>
                <option value="0" {{ old('status', $portfolio->status ?? 1) == 0 ? 'selected' : '' }}>Draft</option>
            </select>
        </div>
    </div>

    <div class="col-span-full">
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description</label>
        <div class="mt-2">
            <textarea id="description" name="description" rows="5" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">{{ old('description', $portfolio->description ?? '') }}</textarea>
        </div>
    </div>

    <!-- Tech Stack (Alpine Array Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Tech Stack</label>
        <div x-data="{ items: {{ json_encode(old('tech_stack', isset($portfolio) && is_array($portfolio->tech_stack) && count($portfolio->tech_stack) > 0 ? $portfolio->tech_stack : [''])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-2 mt-2">
                    <input type="text" x-model="items[index]" :name="'tech_stack[' + index + ']'" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push('')" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Technology</button>
        </div>
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.portfolios.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Save Project</button>
</div>
