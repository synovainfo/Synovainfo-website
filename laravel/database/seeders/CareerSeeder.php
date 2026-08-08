<?php

namespace Database\Seeders;

use App\Models\Career;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CareerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/careers.json'));
        $data = json_decode($json, true);

        $admin = User::first();
        if (!$admin) {
            $admin = User::factory()->create();
        }

        foreach ($data as $index => $item) {
            Career::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'title' => $item['title'],
                    'department' => $item['department'] ?? null,
                    'location' => $item['location'] ?? null,
                    'type' => \App\Enums\CareerType::FULL_TIME,
                    'description' => $item['description'] ?? null,
                    'requirements' => $item['requirements'] ?? [],
                    'benefits' => $item['benefits'] ?? [],
                    'status' => true,
                    'created_by_id' => $admin->id,
                ]
            );
        }
    }
}
