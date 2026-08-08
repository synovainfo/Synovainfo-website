<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    /**
     * Seed the blog taxonomy used by public insights.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Cloud & Platform Engineering', 'slug' => 'cloud-architecture', 'description' => 'Multi-cloud platforms, Kubernetes at scale, migrations, and platform operations.'],
            ['name' => 'AI & Data Engineering', 'slug' => 'ai-data', 'description' => 'Enterprise AI, LLM orchestration, machine learning pipelines, and governed data platforms.'],
            ['name' => 'Security & Compliance', 'slug' => 'security-compliance', 'description' => 'Zero-trust architecture, identity, and continuous compliance for regulated industries.'],
        ];

        foreach ($categories as $category) {
            BlogCategory::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                ]
            );
        }
    }
}
