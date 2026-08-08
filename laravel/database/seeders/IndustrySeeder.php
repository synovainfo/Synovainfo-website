<?php

namespace Database\Seeders;

use App\Models\Industry;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/industries.json'));
        $data = json_decode($json, true);

        // Get admin user for created_by_id
        $admin = User::first();
        if (!$admin) {
            $admin = User::factory()->create();
        }

        foreach ($data as $index => $item) {
            Industry::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'name' => $item['name'],
                    'description' => $item['fullDescription'] ?? ($item['shortDescription'] ?? null),
                    'icon' => $item['icon'] ?? null,
                    'capabilities' => $item['capabilities'] ?? [],
                    'status' => true,
                    'created_by_id' => $admin->id,
                ]
            );
        }
    }
}
