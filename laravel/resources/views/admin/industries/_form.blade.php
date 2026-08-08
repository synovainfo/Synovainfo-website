<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <!-- Name -->
    <div class="sm:col-span-4">
        <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="name" id="name" value="{{ old('name', $industry->name ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('name') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Slug -->
    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $industry->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Status -->
    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('status', $industry->status ?? 1) == 1 ? 'selected' : '' }}>Active</option>
                <option value="0" {{ old('status', $industry->status ?? 1) == 0 ? 'selected' : '' }}>Draft</option>
            </select>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Description -->
    <div class="col-span-full">
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description</label>
        <div class="mt-2">
            <textarea id="description" name="description" rows="4" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('description', $industry->description ?? '') }}</textarea>
        </div>
        @error('description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Capabilities (Alpine Array Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Capabilities</label>
        <div x-data="{ items: {{ json_encode(old('capabilities', $industry->capabilities ?? [''])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-2 mt-2">
                    <input type="text" x-model="items[index]" :name="'capabilities[' + index + ']'" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push('')" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Capability</button>
        </div>
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.industries.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save Industry</button>
</div>
