<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            AdminUserSeeder::class,
            PageSeeder::class,
            ServiceSeeder::class,
            IndustrySeeder::class,
            CaseStudySeeder::class,
            CareerSeeder::class,
            SolutionSeeder::class,
            TechnologySeeder::class,
            BlogCategorySeeder::class,
            BlogPostSeeder::class,
        ]);
    }
}
