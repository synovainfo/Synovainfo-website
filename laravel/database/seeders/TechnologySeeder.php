<?php

namespace Database\Seeders;

use App\Models\Technology;
use App\Models\User;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Seed the technologies table from the Next.js stack data.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/technologies.json'));
        $data = json_decode($json, true);

        if (!is_array($data)) {
            $this->command->warn('technologies.json missing or invalid — skipping.');

            return;
        }

        $admin = User::first();
        if (!$admin) {
            $admin = User::factory()->create();
        }

        foreach ($data as $item) {
            Technology::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'name' => $item['name'],
                    'category' => $item['category'] ?? null,
                    'description' => $item['description'] ?? null,
                    'status' => true,
                    'created_by_id' => $admin->id,
                ]
            );
        }
    }
}
