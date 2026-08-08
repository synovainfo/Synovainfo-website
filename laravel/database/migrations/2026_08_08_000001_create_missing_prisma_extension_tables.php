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
            $table->string('clientName')->nullable();
            $table->string('clientLogo')->nullable();
            $table->string('featuredImage')->nullable();
            $table->json('gallery')->nullable();
            $table->string('industry')->nullable();
            $table->json('techStack')->nullable();
            $table->json('metrics')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamp('publishedAt')->nullable();
            $table->string('seoTitle')->nullable();
            $table->string('seoDescription')->nullable();
            $table->string('createdById')->nullable();
            $table->string('updatedById')->nullable();
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->timestamp('deletedAt')->nullable();
            $table->index(['status']);
            $table->index(['industry']);
            $table->index(['deletedAt']);
        });

        Schema::create('portfolios', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('clientName')->nullable();
            $table->string('featuredImage')->nullable();
            $table->json('gallery')->nullable();
            $table->string('projectUrl')->nullable();
            $table->string('category')->nullable();
            $table->json('techStack')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamp('publishedAt')->nullable();
            $table->string('seoTitle')->nullable();
            $table->string('seoDescription')->nullable();
            $table->string('createdById')->nullable();
            $table->string('updatedById')->nullable();
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->timestamp('deletedAt')->nullable();
            $table->index(['status']);
            $table->index(['category']);
            $table->index(['deletedAt']);
        });

        Schema::create('solutions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('shortDescription')->nullable();
            $table->longText('fullDescription')->nullable();
            $table->string('icon')->nullable();
            $table->json('features')->nullable();
            $table->json('benefits')->nullable();
            $table->boolean('status')->default(true);
            $table->string('seoTitle')->nullable();
            $table->string('seoDescription')->nullable();
            $table->string('createdById')->nullable();
            $table->string('updatedById')->nullable();
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->timestamp('deletedAt')->nullable();
            $table->index(['status']);
            $table->index(['deletedAt']);
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
            $table->string('createdById')->nullable();
            $table->string('updatedById')->nullable();
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->timestamp('deletedAt')->nullable();
            $table->index(['status']);
            $table->index(['deletedAt']);
        });

        Schema::create('gallery_albums', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('coverImage')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->index(['status']);
        });

        Schema::create('gallery_images', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('albumId');
            $table->string('title')->nullable();
            $table->string('altText')->nullable();
            $table->string('url');
            $table->string('thumbnailUrl')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->index(['albumId']);
            $table->index(['status']);
        });

        Schema::create('seo_meta', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('path')->unique();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('keywords')->nullable();
            $table->string('canonicalUrl')->nullable();
            $table->string('ogTitle')->nullable();
            $table->string('ogDescription')->nullable();
            $table->string('ogImage')->nullable();
            $table->string('robots')->nullable();
            $table->json('structuredData')->nullable();
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
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
