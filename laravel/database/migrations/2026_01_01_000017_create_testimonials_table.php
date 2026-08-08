<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->text('quote');
            $table->string('author');
            $table->string('title')->nullable();
            $table->string('company')->nullable();
            $table->string('avatar')->nullable();
            $table->string('image_url')->nullable();
            $table->integer('rating')->default(5);
            $table->boolean('status')->default(true);
            $table->integer('order')->default(0);
            $table->ulid('created_by_id')->nullable();
            $table->ulid('updated_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by_id')->references('id')->on('users')->onDelete('set null');

            $table->index('status');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
