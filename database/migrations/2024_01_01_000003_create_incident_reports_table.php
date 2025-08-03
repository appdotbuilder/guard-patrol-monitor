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
        Schema::create('incident_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->comment('Brief title of the incident');
            $table->text('description')->comment('Detailed description of the incident');
            $table->decimal('latitude', 10, 8)->comment('Latitude coordinate of incident location');
            $table->decimal('longitude', 11, 8)->comment('Longitude coordinate of incident location');
            $table->string('location_name')->nullable()->comment('Human readable location name');
            $table->timestamp('incident_time')->comment('When the incident occurred');
            $table->json('attachments')->nullable()->comment('Photos and videos attached to the report');
            $table->enum('status', ['pending', 'under_review', 'resolved'])->default('pending');
            $table->text('admin_notes')->nullable()->comment('Notes added by admin/supervisor');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'incident_time']);
            $table->index(['status', 'incident_time']);
            $table->index('incident_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incident_reports');
    }
};