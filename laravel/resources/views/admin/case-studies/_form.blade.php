<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <!-- Title -->
    <div class="sm:col-span-4">
        <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Title <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="title" id="title" value="{{ old('title', $caseStudy->title ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('title') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Slug -->
    <div class="sm:col-span-4">
        <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $caseStudy->slug ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Client Name -->
    <div class="sm:col-span-3">
        <label for="client_name" class="block text-sm font-medium leading-6 text-slate-900">Client Name</label>
        <div class="mt-2">
            <input type="text" name="client_name" id="client_name" value="{{ old('client_name', $caseStudy->client_name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- Industry -->
    <div class="sm:col-span-3">
        <label for="industry" class="block text-sm font-medium leading-6 text-slate-900">Industry</label>
        <div class="mt-2">
            <input type="text" name="industry" id="industry" value="{{ old('industry', $caseStudy->industry ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- Status -->
    <div class="sm:col-span-3">
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('status', $caseStudy->status ?? 1) == 1 ? 'selected' : '' }}>Published</option>
                <option value="0" {{ old('status', $caseStudy->status ?? 1) == 0 ? 'selected' : '' }}>Draft</option>
            </select>
        </div>
    </div>

    <!-- Summary -->
    <div class="col-span-full">
        <label for="summary" class="block text-sm font-medium leading-6 text-slate-900">Executive Summary</label>
        <div class="mt-2">
            <textarea id="summary" name="summary" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('summary', $caseStudy->summary ?? '') }}</textarea>
        </div>
    </div>

    <!-- Challenge -->
    <div class="col-span-full">
        <label for="challenge" class="block text-sm font-medium leading-6 text-slate-900">The Challenge</label>
        <div class="mt-2">
            <textarea id="challenge" name="challenge" rows="4" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('challenge', $caseStudy->challenge ?? '') }}</textarea>
        </div>
    </div>

    <!-- Solution -->
    <div class="col-span-full">
        <label for="solution" class="block text-sm font-medium leading-6 text-slate-900">The Solution</label>
        <div class="mt-2">
            <textarea id="solution" name="solution" rows="4" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('solution', $caseStudy->solution ?? '') }}</textarea>
        </div>
    </div>

    <!-- Metrics (Alpine Array of Objects Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Impact Metrics</label>
        <div x-data="{ items: {{ json_encode(old('metrics', isset($caseStudy) && is_array($caseStudy->metrics) && count($caseStudy->metrics) > 0 ? $caseStudy->metrics : [['label' => '', 'value' => '']])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-4 mt-2">
                    <input type="text" x-model="item.label" :name="'metrics[' + index + '][label]'" placeholder="Metric Name (e.g. ROI)" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <input type="text" x-model="item.value" :name="'metrics[' + index + '][value]'" placeholder="Value (e.g. 300%)" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push({label: '', value: ''})" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Metric</button>
        </div>
    </div>

    <!-- Tech Stack (Alpine Array Component) -->
    <div class="col-span-full">
        <label class="block text-sm font-medium leading-6 text-slate-900 mb-2">Tech Stack</label>
        <div x-data="{ items: {{ json_encode(old('tech_stack', isset($caseStudy) && is_array($caseStudy->tech_stack) && count($caseStudy->tech_stack) > 0 ? $caseStudy->tech_stack : [''])) }} }">
            <template x-for="(item, index) in items" :key="index">
                <div class="flex gap-2 mt-2">
                    <input type="text" x-model="items[index]" :name="'tech_stack[' + index + ']'" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <button type="button" @click="items.splice(index, 1)" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Remove</button>
                </div>
            </template>
            <button type="button" @click="items.push('')" class="mt-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Add Technology</button>
        </div>
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.case-studies.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save Case Study</button>
</div>
