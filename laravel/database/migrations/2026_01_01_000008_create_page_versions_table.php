<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('page_id');
            $table->integer('version_number');
            $table->json('content')->nullable();
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->string('status')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->ulid('created_by_id');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users');

            $table->unique(['page_id', 'version_number']);
            $table->index('page_id');
            $table->index('created_by_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_versions');
    }
};
