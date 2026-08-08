<x-admin-layout>
    <x-slot name="title">Site Settings</x-slot>

    <x-admin.page-header title="Global Site Configurations" description="Manage enterprise branding, contact information, and default SEO parameters." />

    <div x-data="{ tab: 'general' }" class="bg-white shadow sm:rounded-lg border border-slate-200">
        <!-- Tab navigation -->
        <div class="border-b border-slate-200">
            <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                <button type="button" @click="tab = 'general'" :class="tab === 'general' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                    General Branding
                </button>
                <button type="button" @click="tab = 'contact'" :class="tab === 'contact' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                    Contact & Social
                </button>
                <button type="button" @click="tab = 'seo'" :class="tab === 'seo' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                    SEO Defaults
                </button>
            </nav>
        </div>

        <form action="{{ route('admin.site-configs.store') }}" method="POST" class="p-6">
            @csrf

            <!-- General Tab -->
            <div x-show="tab === 'general'" class="space-y-6">
                <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">General Branding & Information</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    @foreach($defaultSettings['general'] as $key => $config)
                        <div class="{{ $config['type'] === 'textarea' ? 'col-span-full' : 'col-span-1' }}">
                            <label for="setting_{{ $key }}" class="block text-sm font-medium text-slate-900">{{ $config['label'] }}</label>
                            <div class="mt-2">
                                @if($config['type'] === 'textarea')
                                    <textarea name="settings[{{ $key }}]" id="setting_{{ $key }}" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm">{{ old("settings.$key", $dbConfigs[$key]->value ?? $config['value']) }}</textarea>
                                @else
                                    <input type="{{ $config['type'] }}" name="settings[{{ $key }}]" id="setting_{{ $key }}" value="{{ old("settings.$key", $dbConfigs[$key]->value ?? $config['value']) }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm">
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Contact Tab -->
            <div x-show="tab === 'contact'" class="space-y-6" style="display: none;">
                <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Contact Details & Social Links</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    @foreach($defaultSettings['contact'] as $key => $config)
                        <div class="col-span-1">
                            <label for="setting_{{ $key }}" class="block text-sm font-medium text-slate-900">{{ $config['label'] }}</label>
                            <div class="mt-2">
                                <input type="{{ $config['type'] }}" name="settings[{{ $key }}]" id="setting_{{ $key }}" value="{{ old("settings.$key", $dbConfigs[$key]->value ?? $config['value']) }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm">
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- SEO Tab -->
            <div x-show="tab === 'seo'" class="space-y-6" style="display: none;">
                <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Global Default Meta Tags</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    @foreach($defaultSettings['seo'] as $key => $config)
                        <div class="{{ $config['type'] === 'textarea' ? 'col-span-full' : 'col-span-1' }}">
                            <label for="setting_{{ $key }}" class="block text-sm font-medium text-slate-900">{{ $config['label'] }}</label>
                            <div class="mt-2">
                                @if($config['type'] === 'textarea')
                                    <textarea name="settings[{{ $key }}]" id="setting_{{ $key }}" rows="3" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm">{{ old("settings.$key", $dbConfigs[$key]->value ?? $config['value']) }}</textarea>
                                @else
                                    <input type="{{ $config['type'] }}" name="settings[{{ $key }}]" id="setting_{{ $key }}" value="{{ old("settings.$key", $dbConfigs[$key]->value ?? $config['value']) }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-orange-600 sm:text-sm">
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="mt-8 flex justify-end border-t border-slate-100 pt-6">
                <button type="submit" class="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Save Configuration</button>
            </div>
        </form>
    </div>
</x-admin-layout>
