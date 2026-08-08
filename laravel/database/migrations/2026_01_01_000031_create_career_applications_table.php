<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_applications', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('career_id');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('resume_url')->nullable();
            $table->text('cover_letter')->nullable();
            $table->string('status')->default('NEW');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('career_id')->references('id')->on('careers')->onDelete('cascade');

            $table->index('career_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_applications');
    }
};
