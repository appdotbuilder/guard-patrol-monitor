<?php

namespace Tests\Feature;

use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_guard_can_view_attendance_records(): void
    {
        $guard = User::factory()->create(['role' => 'user']);
        AttendanceRecord::factory(3)->for($guard)->create();

        $response = $this->actingAs($guard)->get('/attendance');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('attendance/index')
                ->has('attendanceRecords.data', 3)
        );
    }

    public function test_admin_cannot_access_attendance_directly(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/attendance');

        $response->assertStatus(403);
    }

    public function test_security_guard_can_check_in(): void
    {
        $guard = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($guard)->post('/attendance', [
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'location_name' => 'Main Entrance',
        ]);

        $response->assertRedirect('/dashboard');
        
        $this->assertDatabaseHas('attendance_records', [
            'user_id' => $guard->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'location_name' => 'Main Entrance',
        ]);
    }

    public function test_security_guard_can_check_out(): void
    {
        $guard = User::factory()->create(['role' => 'user']);
        $attendance = AttendanceRecord::factory()->for($guard)->active()->create();

        $response = $this->actingAs($guard)->patch("/attendance/{$attendance->id}");

        $response->assertRedirect('/dashboard');
        
        $attendance->refresh();
        $this->assertNotNull($attendance->check_out_time);
    }

    public function test_guard_cannot_update_other_guards_attendance(): void
    {
        $guard1 = User::factory()->create(['role' => 'user']);
        $guard2 = User::factory()->create(['role' => 'user']);
        $attendance = AttendanceRecord::factory()->for($guard2)->active()->create();

        $response = $this->actingAs($guard1)->patch("/attendance/{$attendance->id}");

        $response->assertStatus(403);
    }
}