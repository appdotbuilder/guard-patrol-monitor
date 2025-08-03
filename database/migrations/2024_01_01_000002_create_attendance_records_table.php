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
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('latitude', 10, 8)->comment('Latitude coordinate of check-in location');
            $table->decimal('longitude', 11, 8)->comment('Longitude coordinate of check-in location');
            $table->string('location_name')->nullable()->comment('Human readable location name');
            $table->timestamp('check_in_time')->comment('Time when user checked in');
            $table->timestamp('check_out_time')->nullable()->comment('Time when user checked out');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'check_in_time']);
            $table->index('check_in_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};