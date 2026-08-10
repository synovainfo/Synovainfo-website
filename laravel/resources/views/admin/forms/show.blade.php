<x-admin-layout>
    <x-slot name="title">View Form</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.forms.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Forms</a>
    </div>

    <x-admin.page-header title="Form Details: {{ $form->name }}" description="View form configuration." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 p-6 max-w-4xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ $form->name }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $form->slug }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Button Text</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $form->submit_button_text }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Notification</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $form->email_notification ?? 'N/A' }}</dd>
            </div>

            <div class="col-span-full">
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</dt>
                <dd class="mt-2 text-sm text-slate-800 bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap">{{ $form->description ?? 'No description provided.' }}</dd>
            </div>
            
            <div class="col-span-full">
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Success Message</dt>
                <dd class="mt-2 text-sm text-slate-800 bg-green-50 p-4 rounded-md border border-green-200 whitespace-pre-wrap">{{ $form->success_message ?? 'Default success message.' }}</dd>
            </div>
        </div>

        <div class="mt-8 border-t border-slate-200 pt-6 flex items-center justify-between">
            <form action="{{ route('admin.forms.destroy', $form) }}" method="POST" onsubmit="return confirm('Delete this form?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm font-semibold text-red-600 hover:text-red-800">Delete Form</button>
            </form>
        </div>
    </div>
</x-admin-layout>
