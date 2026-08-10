<div class="space-y-6">
    <div>
        <label for="subject" class="block text-sm font-medium leading-6 text-slate-900">Subject <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="subject" id="subject" required value="{{ old('subject', $newsletter->subject ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('subject') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <select name="status" id="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="draft" {{ old('status', $newsletter->status ?? 'draft') === 'draft' ? 'selected' : '' }}>Draft</option>
                <option value="scheduled" {{ old('status', $newsletter->status ?? '') === 'scheduled' ? 'selected' : '' }}>Scheduled</option>
                <option value="sent" {{ old('status', $newsletter->status ?? '') === 'sent' ? 'selected' : '' }}>Sent</option>
            </select>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="body" class="block text-sm font-medium leading-6 text-slate-900">Body Content <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <textarea name="body" id="body" rows="10" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('body', $newsletter->body ?? '') }}</textarea>
        </div>
        @error('body') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 border-t border-slate-200 pt-5 flex justify-end gap-3">
    <a href="{{ route('admin.newsletters.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Cancel</a>
    <button type="submit" class="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
        {{ $newsletter ? 'Update Newsletter' : 'Save Newsletter' }}
    </button>
</div>
