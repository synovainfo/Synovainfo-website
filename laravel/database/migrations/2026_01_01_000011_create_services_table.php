<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            $table->ulid('created_by_id')->nullable();
            $table->ulid('updated_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by_id')->references('id')->on('users')->onDelete('set null');

            $table->index('slug');
            $table->index('status');
            $table->index('category');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
