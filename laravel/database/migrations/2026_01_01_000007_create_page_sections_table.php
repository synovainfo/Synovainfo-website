<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('page_id');
            $table->string('section_type');
            $table->string('title')->nullable();
            $table->json('content')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');

            $table->index('page_id');
            $table->index('section_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
