<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Batch 2 (core CMS): pages, page_sections, page_versions, homepage_sections,
 * redirects, seo_meta.
 *
 * Note: `seo_meta` has no Prisma counterpart. It is added here to back the
 * admin "seo" module you asked for — per-route meta overrides keyed by path.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->json('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('status')->default('DRAFT');
            $table->string('featured_image')->nullable();
            $table->string('template')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->foreignUlid('author_id')->constrained('users')->restrictOnDelete();
            $table->ulid('parent_id')->nullable();
            $table->text('custom_css')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('parent_id');
        });

        // Self-referential FK added after creation so the table exists first.
        Schema::table('pages', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('pages')->nullOnDelete();
        });

        Schema::create('page_sections', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('page_id')->constrained('pages')->cascadeOnDelete();
            $table->string('section_type');
            $table->string('title')->nullable();
            $table->json('content')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->index('section_type');
        });

        Schema::create('page_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('page_id')->constrained('pages')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->json('content')->nullable();
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->string('status')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignUlid('created_by_id')->constrained('users')->restrictOnDelete();
            $table->timestamp('created_at')->nullable();

            $table->unique(['page_id', 'version_number']);
        });

        Schema::create('homepage_sections', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('section_type');
            $table->string('title')->nullable();
            $table->json('content')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->index('section_type');
        });

        Schema::create('redirects', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('source')->unique();
            $table->string('target');
            $table->string('type')->default('PERMANENT_301');
            $table->boolean('is_wildcard')->default(false);
            $table->boolean('status')->default(true);
            $table->unsignedBigInteger('hit_count')->default(0);
            $table->timestamp('last_hit_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('seo_meta', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('path')->unique();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('robots')->default('index,follow');
            $table->json('structured_data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_meta');
        Schema::dropIfExists('redirects');
        Schema::dropIfExists('homepage_sections');
        Schema::dropIfExists('page_versions');
        Schema::dropIfExists('page_sections');

        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });

        Schema::dropIfExists('pages');
    }
};
