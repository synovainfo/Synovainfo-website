<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('album_id');
            $table->string('title')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('url');
            $table->string('thumbnail_url')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->foreign('album_id')->references('id')->on('gallery_albums')->onDelete('cascade');

            $table->index('album_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
