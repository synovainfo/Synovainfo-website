<?php

return [
    'home' => [
        'title' => 'Enterprise Software Solutions & Digital Transformation',
        'description' => 'Synova Infotech delivers custom software, enterprise business solutions, IT infrastructure, and AI/VR technology services for organizations of all sizes.',
        'keywords' => 'enterprise software development, IT infrastructure, digital transformation, AI solutions, networking, Synova Infotech Pune',
        'og_image' => 'images/global/og-home.png',
        'canonical' => env('APP_URL', 'https://synovainfo.com'),
        'schema_json' => json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'Synova Infotech',
            'url' => 'https://synovainfo.com',
            'logo' => 'https://synovainfo.com/images/global/synova-logo.svg',
            'description' => 'Synova Infotech Private Limited is a technology solutions and IT services company delivering custom software, enterprise applications, and digital transformation.',
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'contactType' => 'Sales',
                'email' => 'contact@synovainfo.com',
            ],
        ]),
    ],
];
