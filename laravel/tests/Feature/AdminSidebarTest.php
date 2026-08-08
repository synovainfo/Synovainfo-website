<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSidebarTest extends TestCase
{
    public function test_all_admin_sidebar_routes_render_successfully(): void
    {
        $user = User::first() ?? User::factory()->create([
            'role' => 'super_admin',
        ]);

        $routes = [
            'admin.dashboard',
            'admin.pages.index',
            'admin.blog-posts.index',
            'admin.blog-categories.index',
            'admin.tags.index',
            'admin.case-studies.index',
            'admin.portfolios.index',
            'admin.team-members.index',
            'admin.services.index',
            'admin.industries.index',
            'admin.technologies.index',
            'admin.solutions.index',
            'admin.careers.index',
            'admin.career-applications.index',
            'admin.leads.index',
            'admin.contacts.index',
            'admin.forms.index',
            'admin.newsletters.index',
            'admin.subscribers.index',
            'admin.media.index',
            'admin.menus.index',
            'admin.gallery-albums.index',
            'admin.users.index',
            'admin.site-configs.index',
            'admin.audit-logs.index',
        ];

        foreach ($routes as $routeName) {
            $this->assertTrue(
                \Illuminate\Support\Facades\Route::has($routeName),
                "Route {$routeName} does not exist!"
            );

            $response = $this->actingAs($user)->get(route($routeName));

            $response->assertStatus(200);
        }
    }
}
