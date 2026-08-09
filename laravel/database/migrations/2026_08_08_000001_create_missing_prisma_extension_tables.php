<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the tables that exist only on the Laravel side (no Prisma model):
 * case_studies, portfolios, solutions, team_members, gallery_albums,
 * gallery_images and seo_meta. Columns follow the camelCase convention of
 * the Prisma-generated database.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->longText('challenge')->nullable();
            $table->longText('solution')->nullable();
            $table->longText('results')->nullable();
            $table->string('client_name')->nullable();
            $table->string('client_logo')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('industry')->nullable();
            $table->json('tech_stack')->nullable();
            $table->json('metrics')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('created_by_id')->nullable();
            $table->string('updated_by_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->index(['status']);
            $table->index(['industry']);
            $table->index(['deleted_at']);
        });

        Schema::create('portfolios', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('client_name')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('project_url')->nullable();
            $table->string('category')->nullable();
            $table->json('tech_stack')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('created_by_id')->nullable();
            $table->string('updated_by_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->index(['status']);
            $table->index(['category']);
            $table->index(['deleted_at']);
        });

        Schema::create('solutions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('full_description')->nullable();
            $table->string('icon')->nullable();
            $table->json('features')->nullable();
            $table->json('benefits')->nullable();
            $table->boolean('status')->default(true);
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('created_by_id')->nullable();
            $table->string('updated_by_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->index(['status']);
            $table->index(['deleted_at']);
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('designation')->nullable();
            $table->string('department')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('email')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->string('created_by_id')->nullable();
            $table->string('updated_by_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->index(['status']);
            $table->index(['deleted_at']);
        });

        Schema::create('gallery_albums', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['status']);
        });

        Schema::create('gallery_images', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('album_id');
            $table->string('title')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('url');
            $table->string('thumbnail_url')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['album_id']);
            $table->index(['status']);
        });

        Schema::create('seo_meta', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('path')->unique();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->string('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots')->nullable();
            $table->json('structured_data')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['path']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_meta');
        Schema::dropIfExists('gallery_images');
        Schema::dropIfExists('gallery_albums');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('solutions');
        Schema::dropIfExists('portfolios');
        Schema::dropIfExists('case_studies');
    }
};
