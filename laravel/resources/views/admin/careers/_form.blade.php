<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <!-- Title -->
    <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" value="{{ old('title', $career->title ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Slug -->
    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $career->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Department -->
    <div class="sm:col-span-3">
        <label for="department" class="block text-sm font-medium leading-6 text-slate-900">Department</label>
        <div class="mt-2">
            <input type="text" name="department" id="department" value="{{ old('department', $career->department ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- Location -->
    <div class="sm:col-span-3">
        <label for="location" class="block text-sm font-medium leading-6 text-slate-900">Location</label>
        <div class="mt-2">
            <input type="text" name="location" id="location" value="{{ old('location', $career->location ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- Type -->
    <div class="sm:col-span-3">
        <label for="type" class="block text-sm font-medium leading-6 text-slate-900">Job Type</label>
        <div class="mt-2">
            @php $currentType = isset($career) && is_object($career->type) ? $career->type->value : ($career->type ?? ''); @endphp
            <select id="type" name="type" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                @foreach(\App\Enums\CareerType::cases() as $type)
                    <option value="{{ $type->value }}" {{ old('type', $currentType) === $type->value ? 'selected' : '' }}>{{ ucfirst(strtolower($type->value)) }}</option>
                @endforeach
            </select>
        </div>
        @error('type') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Status -->
    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('status', $career->status ?? 1) == 1 ? 'selected' : '' }}>Active</option>
                <option value="0" {{ old('status', $career->status ?? 1) == 0 ? 'selected' : '' }}>Draft</option>
            </select>
        </div>
    </div>

    <!-- Salary Range -->
    <div class="sm:col-span-3">
        <label for="salary_min" class="block text-sm font-medium leading-6 text-slate-900">Salary Min</label>
        <div class="mt-2">
            <input type="number" name="salary_min" id="salary_min" value="{{ old('salary_min', $career->salary_min ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>
    
    <div class="sm:col-span-3">
        <label for="salary_max" class="block text-sm font-medium leading-6 text-slate-900">Salary Max</label>
        <div class="mt-2">
            <input type="number" name="salary_max" id="salary_max" value="{{ old('salary_max', $career->salary_max ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- Description -->
    <div class="col-span-full">
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Job Description</label>
        <div class="mt-2">
            <textarea id="description" name="description" rows="4" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('description', $career->description ?? '') }}</textarea>
        </div>
    </div>

    <!-- Requirements (Alpine Array Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Requirements</label>
        <div x-data="{ items: {{ json_encode(old('requirements', isset($career) && is_array($career->requirements) && count($career->requirements) > 0 ? $career->requirements : [''])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-2 mt-2">
                    <input type="text" x-model="items[index]" :name="'requirements[' + index + ']'" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push('')" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Requirement</button>
        </div>
    </div>

    <!-- Benefits (Alpine Array Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Benefits & Perks</label>
        <div x-data="{ items: {{ json_encode(old('benefits', isset($career) && is_array($career->benefits) && count($career->benefits) > 0 ? $career->benefits : [''])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-2 mt-2">
                    <input type="text" x-model="items[index]" :name="'benefits[' + index + ']'" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push('')" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Benefit</button>
        </div>
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.careers.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save Position</button>
</div>
