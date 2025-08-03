<?php

namespace Tests\Feature;

use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IncidentReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_guard_can_view_own_incident_reports(): void
    {
        $guard = User::factory()->create(['role' => 'user']);
        IncidentReport::factory(3)->for($guard)->create();
        IncidentReport::factory(2)->create(); // Other guards' reports

        $response = $this->actingAs($guard)->get('/incident-reports');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('incident-reports/index')
                ->has('incidentReports.data', 3)
                ->where('canManage', false)
        );
    }

    public function test_admin_can_view_all_incident_reports(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        IncidentReport::factory(5)->create();

        $response = $this->actingAs($admin)->get('/incident-reports');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('incident-reports/index')
                ->has('incidentReports.data', 5)
                ->where('canManage', true)
        );
    }

    public function test_security_guard_can_create_incident_report(): void
    {
        $guard = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($guard)->post('/incident-reports', [
            'title' => 'Suspicious Activity',
            'description' => 'Observed individual acting suspiciously near main entrance.',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'location_name' => 'Main Entrance',
            'incident_time' => now()->toDateTimeString(),
        ]);

        $response->assertRedirect('/incident-reports');
        
        $this->assertDatabaseHas('incident_reports', [
            'user_id' => $guard->id,
            'title' => 'Suspicious Activity',
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_update_incident_report_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $guard = User::factory()->create(['role' => 'user']);
        $report = IncidentReport::factory()->for($guard)->create(['status' => 'pending']);

        $response = $this->actingAs($admin)->patch("/incident-reports/{$report->id}", [
            'status' => 'under_review',
            'admin_notes' => 'Investigation started.',
        ]);

        $response->assertRedirect("/incident-reports/{$report->id}");
        
        $report->refresh();
        $this->assertEquals('under_review', $report->status);
        $this->assertEquals('Investigation started.', $report->admin_notes);
    }

    public function test_guard_can_edit_own_pending_report(): void
    {
        $guard = User::factory()->create(['role' => 'user']);
        $report = IncidentReport::factory()->for($guard)->create(['status' => 'pending']);

        $response = $this->actingAs($guard)->patch("/incident-reports/{$report->id}", [
            'title' => 'Updated Title',
            'description' => 'Updated description.',
            'incident_time' => now()->toDateTimeString(),
        ]);

        $response->assertRedirect("/incident-reports/{$report->id}");
        
        $report->refresh();
        $this->assertEquals('Updated Title', $report->title);
    }

    public function test_guard_cannot_edit_reviewed_report(): void
    {
        $guard = User::factory()->create(['role' => 'user']);
        $report = IncidentReport::factory()->for($guard)->create(['status' => 'under_review']);

        $response = $this->actingAs($guard)->patch("/incident-reports/{$report->id}", [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(403);
    }

    public function test_incident_reports_can_be_filtered_by_date_range(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        // Create reports on different dates
        IncidentReport::factory()->create(['incident_time' => '2024-01-01 10:00:00']);
        IncidentReport::factory()->create(['incident_time' => '2024-01-15 10:00:00']);
        IncidentReport::factory()->create(['incident_time' => '2024-01-30 10:00:00']);

        $response = $this->actingAs($admin)->get('/incident-reports?' . http_build_query([
            'start_date' => '2024-01-10',
            'end_date' => '2024-01-20',
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('incident-reports/index')
                ->has('incidentReports.data', 1)
        );
    }
}