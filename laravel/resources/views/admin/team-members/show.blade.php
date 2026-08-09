<x-admin-layout>
    <x-slot name="title">View Team Member</x-slot>

    <x-admin.page-header title="Team Member Details">
        <a href="{{ route('admin.team-members.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Team Members
        </a>
    </x-admin.page-header>

    <div class="mt-6 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
        <div class="px-4 py-6 sm:p-8 border-b border-slate-200">
            <h3 class="text-base font-semibold leading-7 text-slate-900">Team Member Information</h3>
        </div>
        <div class="border-t border-slate-100">
            <dl class="divide-y divide-slate-100 px-4 sm:px-8">
                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Name</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->name }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Designation</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->designation }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Department</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->department }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Bio</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->bio }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Avatar</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->avatar }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Email</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->email }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Linkedin</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->linkedin }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Twitter</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->twitter }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Order</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->order }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Status</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->status }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Created By Id</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->created_by_id }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Updated By Id</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $teamMember->updated_by_id }}</dd>
                        </div>
            </dl>
        </div>
    </div>
</x-admin-layout>