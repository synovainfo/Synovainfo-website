<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('form_id');
            $table->string('type');
            $table->string('label');
            $table->string('placeholder')->nullable();
            $table->boolean('required')->default(false);
            $table->json('validation_rules')->nullable();
            $table->json('options')->nullable();
            $table->integer('order')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('form_id')->references('id')->on('forms')->onDelete('cascade');

            $table->index('form_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
