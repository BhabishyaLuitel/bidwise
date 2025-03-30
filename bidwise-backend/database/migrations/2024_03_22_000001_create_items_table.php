<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->json('images');
            $table->decimal('starting_price', 10, 2);
            $table->decimal('current_bid', 10, 2);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category');
            $table->timestamp('end_time');
            $table->enum('status', ['active', 'ended', 'sold'])->default('active');
            $table->integer('total_bids')->default(0);
            $table->timestamps();

            // Add indexes for common queries
            $table->index('category');
            $table->index('status');
            $table->index('end_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
}; 