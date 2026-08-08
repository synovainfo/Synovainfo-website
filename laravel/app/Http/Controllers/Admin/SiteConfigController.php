<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use App\Http\Requests\Admin\SiteConfigRequest;
use Illuminate\Http\Request;

class SiteConfigController extends Controller
{
    /**
     * Display a listing of site configurations grouped.
     */
    public function index()
    {
        $defaultSettings = [
            'general' => [
                'site_name' => ['label' => 'Site Name', 'value' => 'Synova Infotech', 'type' => 'text'],
                'site_tagline' => ['label' => 'Site Tagline', 'value' => 'Enterprise Technology & AI Solutions', 'type' => 'text'],
                'footer_copyright' => ['label' => 'Footer Copyright Notice', 'value' => '© ' . date('Y') . ' Synova Infotech Pvt Ltd. All rights reserved.', 'type' => 'text'],
            ],
            'contact' => [
                'contact_email' => ['label' => 'Contact Email', 'value' => 'contact@synovainfotech.com', 'type' => 'email'],
                'contact_phone' => ['label' => 'Contact Phone Number', 'value' => '+1 (555) 019-2834', 'type' => 'text'],
                'office_address' => ['label' => 'Main Office Address', 'value' => '100 Enterprise Way, Suite 500, Tech Park, CA 94025', 'type' => 'text'],
                'linkedin_url' => ['label' => 'LinkedIn Profile URL', 'value' => 'https://linkedin.com/company/synovainfotech', 'type' => 'url'],
                'twitter_url' => ['label' => 'X (Twitter) Profile URL', 'value' => 'https://x.com/synovainfotech', 'type' => 'url'],
            ],
            'seo' => [
                'default_seo_title' => ['label' => 'Default SEO Title', 'value' => 'Synova Infotech | Enterprise AI & Cloud Transformation', 'type' => 'text'],
                'default_seo_description' => ['label' => 'Default Meta Description', 'value' => 'Synova Infotech delivers cutting-edge enterprise AI development, modern cloud architecture, and custom digital transformation services.', 'type' => 'textarea'],
            ],
        ];

        // Fetch existing config key-value pairs from DB
        $dbConfigs = SiteConfig::all()->keyBy('key');

        return view('admin.settings.index', compact('defaultSettings', 'dbConfigs'));
    }

    /**
     * Store or update batch configuration settings.
     */
    public function store(SiteConfigRequest $request)
    {
        $settings = $request->validated()['settings'];

        foreach ($settings as $key => $value) {
            SiteConfig::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value ?? '',
                ]
            );
        }

        return redirect()->route('admin.site-configs.index')
            ->with('success', 'Site configurations saved successfully.');
    }
}
