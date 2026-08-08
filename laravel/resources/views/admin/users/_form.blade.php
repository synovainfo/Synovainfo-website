<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    <!-- Name -->
    <div class="sm:col-span-3">
        <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="text" name="name" id="name" value="{{ old('name', $user->name ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('name') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Email -->
    <div class="sm:col-span-3">
        <label for="email" class="block text-sm font-medium leading-6 text-slate-900">Email Address <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <input type="email" name="email" id="email" value="{{ old('email', $user->email ?? '') }}" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('email') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Password -->
    <div class="sm:col-span-3">
        <label for="password" class="block text-sm font-medium leading-6 text-slate-900">Password {{ isset($user) ? '(Leave blank to keep current)' : '*' }}</label>
        <div class="mt-2">
            <input type="password" name="password" id="password" {{ !isset($user) ? 'required' : '' }} class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
        @error('password') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Password Confirmation -->
    <div class="sm:col-span-3">
        <label for="password_confirmation" class="block text-sm font-medium leading-6 text-slate-900">Confirm Password</label>
        <div class="mt-2">
            <input type="password" name="password_confirmation" id="password_confirmation" {{ !isset($user) ? 'required' : '' }} class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
        </div>
    </div>

    <!-- Role -->
    <div class="sm:col-span-3">
        <label for="role" class="block text-sm font-medium leading-6 text-slate-900">Role <span class="text-red-500">*</span></label>
        <div class="mt-2">
            <select id="role" name="role" required class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                @foreach($roles as $value => $label)
                    <option value="{{ $value }}" {{ old('role', $user->role ?? '') === $value || (isset($userRole) && in_array($value, $userRole)) ? 'selected' : '' }}>
                        {{ $label }}
                    </option>
                @endforeach
            </select>
            <p class="mt-2 text-sm text-slate-500">Super Admins have full access. Admins can manage content. Editors can edit pages. Viewers have read-only access.</p>
        </div>
        @error('role') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>

    <!-- Status -->
    <div class="sm:col-span-3">
        <label for="is_active" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
        <div class="mt-2">
            <select id="is_active" name="is_active" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                <option value="1" {{ old('is_active', $user->is_active ?? 1) == 1 ? 'selected' : '' }}>Active</option>
                <option value="0" {{ old('is_active', $user->is_active ?? 1) == 0 ? 'selected' : '' }}>Inactive</option>
            </select>
        </div>
        @error('is_active') <p class="mt-2 text-sm text-red-600">{{ $message }}</p> @enderror
    </div>
</div>

<div class="mt-8 flex items-center justify-end gap-x-6 border-t border-slate-900/10 pt-8">
    <a href="{{ route('admin.users.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
    <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save User</button>
</div>
