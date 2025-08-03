<?php

namespace Tests\Feature;

use App\Models\AttendanceRecord;
use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_guard_dashboard_shows_relevant_stats(): void
    {
        $guard = User::factory()->create(['role' => 'user']);
        
        // Create some incident reports for the guard
        IncidentReport::factory(3)->for($guard)->create();
        IncidentReport::factory(2)->for($guard)->create(['status' => 'pending']);
        
        // Create today's attendance
        $todayAttendance = AttendanceRecord::factory()->for($guard)->active()->create([
            'check_in_time' => now()->subHours(3),
        ]);

        $response = $this->actingAs($guard)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('dashboard')
                ->where('userRole', 'user')
                ->where('stats.my_incidents', 5)
                ->where('stats.today_attendance.id', $todayAttendance->id)
        );
    }

    public function test_admin_dashboard_shows_management_stats(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        // Create some guards and their data
        IncidentReport::factory(10)->create();

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('dashboard')
                ->where('userRole', 'admin')
                ->has('stats.total_incidents')
                ->has('stats.total_guards')
                ->has('stats.pending_incidents')
        );
    }

    public function test_superadmin_dashboard_shows_all_data(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        
        // Create comprehensive test data
        IncidentReport::factory(15)->create();

        $response = $this->actingAs($superAdmin)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('dashboard')
                ->where('userRole', 'superadmin')
                ->has('stats.total_incidents')
                ->has('stats.total_guards')
                ->has('stats.pending_incidents')
        );
    }

    public function test_dashboard_requires_authentication(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }
}