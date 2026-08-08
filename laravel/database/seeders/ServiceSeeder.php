<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/services.json'));
        $data = json_decode($json, true);

        // Get admin user for created_by_id
        $admin = User::first();
        if (!$admin) {
            $this->command->warn('No users found. Creating a temporary admin for seeder.');
            $admin = User::factory()->create();
        }

        foreach ($data as $index => $item) {
            Service::updateOrCreate(
                ['slug' => $item['id']],
                [
                    'title' => $item['title'],
                    'short_description' => $item['shortDescription'] ?? null,
                    'full_description' => $item['fullDescription'] ?? null,
                    'icon' => $item['icon'] ?? null,
                    'category' => $item['category'] ?? 'solutions',
                    'benefits' => $item['benefits'] ?? [],
                    'business_outcomes' => $item['businessOutcomes'] ?? [],
                    'status' => true,
                    'created_by_id' => $admin->id,
                ]
            );
        }
    }
}
