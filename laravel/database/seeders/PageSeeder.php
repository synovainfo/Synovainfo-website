<?php

namespace Database\Seeders;

use App\Enums\PageStatus;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::first();

        $pages = [
            [
                'title' => 'Home',
                'slug' => '/',
                'status' => PageStatus::PUBLISHED,
                'published_at' => now(),
            ],
            [
                'title' => 'About Us',
                'slug' => 'about',
                'status' => PageStatus::PUBLISHED,
                'published_at' => now(),
            ],
            [
                'title' => 'Our Approach',
                'slug' => 'approach',
                'status' => PageStatus::PUBLISHED,
                'published_at' => now(),
            ],
            [
                'title' => 'Architecture',
                'slug' => 'architecture',
                'status' => PageStatus::PUBLISHED,
                'published_at' => now(),
            ],
        ];

        foreach ($pages as $page) {
            $page['author_id'] = $admin->id;
            Page::firstOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
