<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CaseStudySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/case_studies.json'));
        $data = json_decode($json, true);

        $admin = User::first();
        if (!$admin) {
            $admin = User::factory()->create();
        }

        foreach ($data as $index => $item) {
            CaseStudy::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'title' => $item['title'],
                    'client_name' => $item['client'] ?? null,
                    'industry' => $item['industry'] ?? null,
                    'summary' => $item['summary'] ?? null,
                    'challenge' => $item['challenge'] ?? null,
                    'solution' => $item['solution'] ?? null,
                    'featured_image' => $item['image'] ?? null,
                    'metrics' => $item['impact'] ?? [],
                    'tech_stack' => $item['technologies'] ?? [],
                    'status' => true,
                    'created_by_id' => $admin->id,
                ]
            );
        }
    }
}
