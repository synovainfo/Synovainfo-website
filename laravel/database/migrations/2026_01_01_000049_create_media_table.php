<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('url');
            $table->integer('size')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->string('collection')->nullable();
            $table->ulid('uploaded_by_id')->nullable();
            $table->timestamps();

            $table->foreign('uploaded_by_id')->references('id')->on('users')->onDelete('set null');

            $table->index('collection');
            $table->index('mime_type');
            $table->index('uploaded_by_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
