<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redirects', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('source')->unique();
            $table->string('target');
            $table->string('type')->default('PERMANENT_301');
            $table->boolean('is_wildcard')->default(false);
            $table->boolean('status')->default(true);
            $table->integer('hit_count')->default(0);
            $table->timestamp('last_hit_at')->nullable();
            $table->timestamps();

            $table->index('source');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redirects');
    }
};
