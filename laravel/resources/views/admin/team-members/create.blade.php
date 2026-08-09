<x-admin-layout>
    <x-slot name="title">Create Team Member</x-slot>

    <x-admin.page-header title="Create Team Member">
        <a href="{{ route('admin.team-members.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Team Members
        </a>
    </x-admin.page-header>

    <form action="{{ route('admin.team-members.store') }}" method="POST" class="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2 mt-6">
        @csrf
        <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label for="name" class="block text-sm font-medium leading-6 text-slate-900">Name</label>
                            <div class="mt-2">
                                <input type="text" name="name" id="name" value="{{ old('name', $teamMember->name ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('name')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="designation" class="block text-sm font-medium leading-6 text-slate-900">Designation</label>
                            <div class="mt-2">
                                <input type="text" name="designation" id="designation" value="{{ old('designation', $teamMember->designation ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('designation')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="department" class="block text-sm font-medium leading-6 text-slate-900">Department</label>
                            <div class="mt-2">
                                <input type="text" name="department" id="department" value="{{ old('department', $teamMember->department ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('department')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="bio" class="block text-sm font-medium leading-6 text-slate-900">Bio</label>
                            <div class="mt-2">
                                <input type="text" name="bio" id="bio" value="{{ old('bio', $teamMember->bio ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('bio')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="avatar" class="block text-sm font-medium leading-6 text-slate-900">Avatar</label>
                            <div class="mt-2">
                                <input type="text" name="avatar" id="avatar" value="{{ old('avatar', $teamMember->avatar ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('avatar')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-medium leading-6 text-slate-900">Email</label>
                            <div class="mt-2">
                                <input type="text" name="email" id="email" value="{{ old('email', $teamMember->email ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('email')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="linkedin" class="block text-sm font-medium leading-6 text-slate-900">Linkedin</label>
                            <div class="mt-2">
                                <input type="text" name="linkedin" id="linkedin" value="{{ old('linkedin', $teamMember->linkedin ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('linkedin')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="twitter" class="block text-sm font-medium leading-6 text-slate-900">Twitter</label>
                            <div class="mt-2">
                                <input type="text" name="twitter" id="twitter" value="{{ old('twitter', $teamMember->twitter ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('twitter')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="order" class="block text-sm font-medium leading-6 text-slate-900">Order</label>
                            <div class="mt-2">
                                <input type="text" name="order" id="order" value="{{ old('order', $teamMember->order ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('order')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
                            <div class="mt-2">
                                <input type="text" name="status" id="status" value="{{ old('status', $teamMember->status ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('status')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="created_by_id" class="block text-sm font-medium leading-6 text-slate-900">Created By Id</label>
                            <div class="mt-2">
                                <input type="text" name="created_by_id" id="created_by_id" value="{{ old('created_by_id', $teamMember->created_by_id ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('created_by_id')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="updated_by_id" class="block text-sm font-medium leading-6 text-slate-900">Updated By Id</label>
                            <div class="mt-2">
                                <input type="text" name="updated_by_id" id="updated_by_id" value="{{ old('updated_by_id', $teamMember->updated_by_id ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('updated_by_id')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

            </div>
        </div>
        <div class="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8">
            <a href="{{ route('admin.team-members.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
            <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save</button>
        </div>
    </form>
</x-admin-layout>