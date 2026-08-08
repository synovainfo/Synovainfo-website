<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_sends', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('newsletter_id');
            $table->ulid('subscriber_id');
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('clicked_at')->nullable();

            $table->foreign('newsletter_id')->references('id')->on('newsletters')->onDelete('cascade');
            $table->foreign('subscriber_id')->references('id')->on('subscribers')->onDelete('cascade');

            $table->unique(['newsletter_id', 'subscriber_id']);
            $table->index('newsletter_id');
            $table->index('subscriber_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_sends');
    }
};
