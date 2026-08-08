<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_configs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('group')->default('general');
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string');
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->ulid('updated_by_id')->nullable();
            $table->timestamps();

            $table->foreign('updated_by_id')->references('id')->on('users')->onDelete('set null');

            $table->index('group');
            $table->index('key');
            $table->index('is_public');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_configs');
    }
};
