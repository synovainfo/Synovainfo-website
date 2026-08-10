<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Form Name <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <input type="text" name="name" id="name" required value="{{ old('name', $form->name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('name') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="slug" class="block text-sm font-medium leading-6 text-slate-900">Slug <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <input type="text" name="slug" id="slug" required value="{{ old('slug', $form->slug ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('slug') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="submit_button_text" class="block text-sm font-medium leading-6 text-slate-900">Submit Button Text <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <input type="text" name="submit_button_text" id="submit_button_text" required value="{{ old('submit_button_text', $form->submit_button_text ?? 'Submit') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('submit_button_text') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="email_notification" class="block text-sm font-medium leading-6 text-slate-900">Email Notification (Optional)</label>
            <div class="mt-2">
                <input type="email" name="email_notification" id="email_notification" value="{{ old('email_notification', $form->email_notification ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="admin@example.com">
            </div>
            @error('email_notification') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div>
        <label for="success_message" class="block text-sm font-medium leading-6 text-slate-900">Success Message</label>
        <div class="mt-2">
            <input type="text" name="success_message" id="success_message" value="{{ old('success_message', $form->success_message ?? 'Thank you for your submission.') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('success_message') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <label for="description" class="block text-sm font-medium leading-6 text-slate-900">Description</label>
        <div class="mt-2">
            <textarea name="description" id="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('description', $form->description ?? '') }}</textarea>
        </div>
        @error('description') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <div>
        <div class="relative flex gap-x-3">
            <div class="flex h-6 items-center">
                <input type="hidden" name="status" value="0">
                <input id="status" name="status" type="checkbox" value="1" {{ old('status', $form->status ?? true) ? 'checked' : '' }} class="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600">
            </div>
            <div class="text-sm leading-6">
                <label for="status" class="font-medium text-slate-900">Active Status</label>
                <p class="text-slate-500">Enable or disable this form.</p>
            </div>
        </div>
        @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 border-t border-slate-200 pt-5 flex justify-end gap-3">
    <a href="{{ route('admin.forms.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Cancel</a>
    <button type="submit" class="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
        {{ $form ? 'Update Form' : 'Save Form' }}
    </button>
</div>
