<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Batch 3 (taxonomy & showcase): services, industries, technologies, the two
 * explicit pivots, statistics, testimonials, clients, partners, certifications,
 * core_values.
 *
 * service_technologies / service_industries carry their own ULID id (matching
 * Prisma), so they are modelled as real Pivot models rather than bare pivots.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->text('full_description')->nullable();
            $table->string('icon')->nullable();
            $table->string('category')->nullable();
            $table->json('benefits')->nullable();
            $table->json('business_outcomes')->nullable();
            $table->boolean('status')->default(true);
            $table->string('seo_title')->nullable();
            $table->string('seo_description')->nullable();
            $table->string('seo_keywords')->nullable();
            $table->foreignUlid('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUlid('updated_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('category');
        });

        Schema::create('industries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->json('capabilities')->nullable();
            $table->boolean('status')->default(true);
            $table->foreignUlid('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUlid('updated_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });

        Schema::create('technologies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('website_url')->nullable();
            $table->unsignedTinyInteger('proficiency_level')->default(0);
            $table->boolean('status')->default(true);
            $table->foreignUlid('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUlid('updated_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('category');
            $table->index('status');
        });

        Schema::create('service_technologies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignUlid('technology_id')->constrained('technologies')->cascadeOnDelete();

            $table->unique(['service_id', 'technology_id']);
        });

        Schema::create('service_industries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('service_id')->constrained('services')->cascadeOnDelete();
            $table->foreignUlid('industry_id')->constrained('industries')->cascadeOnDelete();

            $table->unique(['service_id', 'industry_id']);
        });

        Schema::create('statistics', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('label');
            $table->string('value');
            $table->string('prefix')->nullable();
            $table->string('suffix')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('is_visible');
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->text('quote');
            $table->string('author');
            $table->string('title')->nullable();
            $table->string('company')->nullable();
            $table->string('avatar')->nullable();
            $table->string('image_url')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->boolean('status')->default(true);
            $table->integer('order')->default(0);
            $table->foreignUlid('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUlid('updated_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('website_url')->nullable();
            $table->string('industry')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->foreignUlid('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUlid('updated_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('partners', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('is_verified');
        });

        Schema::create('certifications', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('is_verified');
        });

        Schema::create('core_values', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_values');
        Schema::dropIfExists('certifications');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('statistics');
        Schema::dropIfExists('service_industries');
        Schema::dropIfExists('service_technologies');
        Schema::dropIfExists('technologies');
        Schema::dropIfExists('industries');
        Schema::dropIfExists('services');
    }
};
