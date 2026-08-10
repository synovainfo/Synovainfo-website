<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="email" class="block text-sm font-medium leading-6 text-slate-900">Email Address <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <input type="email" name="email" id="email" required value="{{ old('email', $subscriber->email ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('email') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name</label>
            <div class="mt-2">
                <input type="text" name="name" id="name" value="{{ old('name', $subscriber->name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('name') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <select name="status" id="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <option value="subscribed" {{ old('status', $subscriber->status ?? 'subscribed') === 'subscribed' ? 'selected' : '' }}>Subscribed</option>
                    <option value="unsubscribed" {{ old('status', $subscriber->status ?? '') === 'unsubscribed' ? 'selected' : '' }}>Unsubscribed</option>
                </select>
            </div>
            @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="source" class="block text-sm font-medium leading-6 text-slate-900">Source</label>
            <div class="mt-2">
                <input type="text" name="source" id="source" value="{{ old('source', $subscriber->source ?? 'admin_panel') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('source') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>
</div>

<div class="mt-8 border-t border-slate-200 pt-5 flex justify-end gap-3">
    <a href="{{ route('admin.subscribers.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Cancel</a>
    <button type="submit" class="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
        {{ $subscriber ? 'Update Subscriber' : 'Save Subscriber' }}
    </button>
</div>
