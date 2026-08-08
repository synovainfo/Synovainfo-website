<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletters', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('subject');
            $table->text('body');
            $table->timestamp('sent_at')->nullable();
            $table->string('status')->default('DRAFT');
            $table->integer('recipient_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletters');
    }
};
