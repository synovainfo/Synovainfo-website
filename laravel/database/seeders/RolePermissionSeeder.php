<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Core entities to generate permissions for
        $entities = [
            'users',
            'pages',
            'blog_posts',
            'services',
            'industries',
            'technologies',
            'case_studies',
            'portfolios',
            'leads',
            'careers',
            'settings'
        ];

        // Actions
        $actions = ['view', 'create', 'edit', 'delete'];

        // Create permissions
        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$action} {$entity}"]);
            }
        }

        // Create custom permissions
        Permission::firstOrCreate(['name' => 'manage roles']);
        Permission::firstOrCreate(['name' => 'access admin panel']);

        // Create Roles and assign created permissions

        // 1. Super Admin gets all permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        // Spatie's best practice is to grant all permissions to Super Admin via Gate::before in AuthServiceProvider,
        // but we can also explicitly sync them. Let's explicitly sync for clarity.
        $superAdmin->syncPermissions(Permission::all());

        // 2. Admin gets most permissions, maybe except manage roles
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $adminPermissions = Permission::where('name', '!=', 'manage roles')->get();
        $admin->syncPermissions($adminPermissions);

        // 3. Editor gets content permissions
        $editor = Role::firstOrCreate(['name' => 'Editor']);
        $editor->syncPermissions([
            'access admin panel',
            'view pages', 'create pages', 'edit pages',
            'view blog_posts', 'create blog_posts', 'edit blog_posts',
            'view services', 'create services', 'edit services',
        ]);

        // 4. Viewer gets read-only access to admin panel
        $viewer = Role::firstOrCreate(['name' => 'Viewer']);
        $viewer->syncPermissions([
            'access admin panel',
            'view pages',
            'view blog_posts',
            'view services',
            'view leads',
        ]);
    }
}
