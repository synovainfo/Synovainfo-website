<?php

namespace Database\Seeders;

use App\Models\Solution;
use App\Models\User;
use Illuminate\Database\Seeder;

class SolutionSeeder extends Seeder
{
    /**
     * Seed the solutions table from the Next.js solutions data.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/solutions.json'));
        $data = json_decode($json, true);

        if (!is_array($data)) {
            $this->command->warn('solutions.json missing or invalid — skipping.');

            return;
        }

        $admin = User::first();
        if (!$admin) {
            $admin = User::factory()->create();
        }

        foreach ($data as $item) {
            Solution::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'title' => $item['title'],
                    'short_description' => $item['subtitle'] ?? null,
                    'full_description' => $item['overview'] ?? null,
                    'features' => $item['architectureHighlights'] ?? [],
                    'benefits' => $item['businessProblems'] ?? [],
                    'status' => true,
                    'created_by_id' => $admin->id,
                ]
            );
        }
    }
}
