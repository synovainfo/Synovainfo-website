<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('designation')->nullable();
            $table->string('department')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('email')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->ulid('created_by_id')->nullable();
            $table->ulid('updated_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by_id')->references('id')->on('users')->onDelete('set null');

            $table->index('status');
            $table->index('department');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
