<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <input type="text" name="name" id="name" required value="{{ old('name', $contact->name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('name') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="email" class="block text-sm font-medium leading-6 text-slate-900">Email <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <input type="email" name="email" id="email" required value="{{ old('email', $contact->email ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('email') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="company" class="block text-sm font-medium leading-6 text-slate-900">Company</label>
            <div class="mt-2">
                <input type="text" name="company" id="company" value="{{ old('company', $contact->company ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('company') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="phone" class="block text-sm font-medium leading-6 text-slate-900">Phone</label>
            <div class="mt-2">
                <input type="text" name="phone" id="phone" value="{{ old('phone', $contact->phone ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('phone') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="service" class="block text-sm font-medium leading-6 text-slate-900">Service Area</label>
            <div class="mt-2">
                <input type="text" name="service" id="service" value="{{ old('service', $contact->service ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
            </div>
            @error('service') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>

        <div>
            <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status <span class="text-red-500">*</span></label>
            <div class="mt-2">
                <select name="status" id="status" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                    <option value="NEW" {{ old('status', $contact->status ?? 'NEW') === 'NEW' ? 'selected' : '' }}>New</option>
                    <option value="IN_PROGRESS" {{ old('status', $contact->status ?? '') === 'IN_PROGRESS' ? 'selected' : '' }}>In Progress</option>
                    <option value="RESOLVED" {{ old('status', $contact->status ?? '') === 'RESOLVED' ? 'selected' : '' }}>Resolved</option>
                    <option value="CLOSED" {{ old('status', $contact->status ?? '') === 'CLOSED' ? 'selected' : '' }}>Closed</option>
                </select>
            </div>
            @error('status') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
        </div>
    </div>

    <div>
        <label for="message" class="block text-sm font-medium leading-6 text-slate-900">Message</label>
        <div class="mt-2">
            <textarea name="message" id="message" rows="4" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('message', $contact->message ?? '') }}</textarea>
        </div>
        @error('message') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
    
    @if($contact)
    <div>
        <label for="notes" class="block text-sm font-medium leading-6 text-slate-900">Admin Notes</label>
        <div class="mt-2">
            <textarea name="notes" id="notes" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">{{ old('notes', $contact->notes ?? '') }}</textarea>
        </div>
        @error('notes') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
    @endif
</div>

<div class="mt-8 border-t border-slate-200 pt-5 flex justify-end gap-3">
    <a href="{{ route('admin.contacts.index') }}" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">Cancel</a>
    <button type="submit" class="inline-flex justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
        {{ $contact ? 'Update Contact' : 'Save Contact' }}
    </button>
</div>
