<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Batch 6 (site chrome): media_folders, media, menus, menu_items, footers,
 * footer_columns, footer_links.
 *
 * media_folders.parent_id and menu_items.parent_id are self-referential and are
 * added in a follow-up Schema::table() call.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_folders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->ulid('parent_id')->nullable();
            $table->foreignUlid('created_by_id')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('parent_id');
        });

        Schema::table('media_folders', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('media_folders')->nullOnDelete();
        });

        Schema::create('media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->json('tags')->nullable();
            $table->foreignUlid('folder_id')->nullable()->constrained('media_folders')->nullOnDelete();
            $table->foreignUlid('uploaded_by_id')->constrained('users')->restrictOnDelete();
            $table->string('url');
            $table->string('thumbnail_sm')->nullable();
            $table->string('thumbnail_md')->nullable();
            $table->string('thumbnail_lg')->nullable();
            $table->string('webp_url')->nullable();
            $table->unsignedBigInteger('original_size')->nullable();
            $table->unsignedBigInteger('compressed_size')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('mime_type');
        });

        Schema::create('menus', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('location')->nullable();
            $table->timestamps();
        });

        Schema::create('menu_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('menu_id')->constrained('menus')->cascadeOnDelete();
            $table->ulid('parent_id')->nullable();
            $table->string('label');
            $table->string('url')->nullable();
            $table->string('target')->default('_self');
            $table->string('icon')->nullable();
            $table->string('css_class')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->boolean('is_mega_menu')->default(false);
            $table->json('mega_menu_columns')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index('parent_id');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('menu_items')->cascadeOnDelete();
        });

        Schema::create('footers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('footer_columns', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('footer_id')->constrained('footers')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->unsignedTinyInteger('width')->default(3);
            $table->integer('order')->default(0);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('footer_links', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('footer_column_id')->constrained('footer_columns')->cascadeOnDelete();
            $table->string('label');
            $table->string('url')->nullable();
            $table->string('target')->default('_self');
            $table->integer('order')->default(0);
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_links');
        Schema::dropIfExists('footer_columns');
        Schema::dropIfExists('footers');

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menus');
        Schema::dropIfExists('media');

        Schema::table('media_folders', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });
        Schema::dropIfExists('media_folders');
    }
};
