<?php

namespace Database\Factories;

use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IncidentReport>
 */
class IncidentReportFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\IncidentReport>
     */
    protected $model = IncidentReport::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $incidentTypes = [
            'Suspicious Activity',
            'Unauthorized Access',
            'Equipment Malfunction',
            'Safety Hazard',
            'Theft Attempt',
            'Vandalism',
            'Medical Emergency',
            'Fire Safety Issue',
            'Vehicle Incident',
            'Visitor Issue',
        ];

        $locations = [
            'Main Entrance',
            'Parking Lot A',
            'Parking Lot B',
            'Building 2 - Floor 3',
            'Reception Area',
            'Loading Dock',
            'Emergency Exit',
            'Security Office',
            'Cafeteria',
            'Elevator Bank',
        ];

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->randomElement($incidentTypes) . ' - ' . $this->faker->words(2, true),
            'description' => $this->faker->paragraphs(2, true),
            'latitude' => $this->faker->latitude(-90, 90),
            'longitude' => $this->faker->longitude(-180, 180),
            'location_name' => $this->faker->randomElement($locations),
            'incident_time' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'status' => $this->faker->randomElement(['pending', 'under_review', 'resolved']),
            'attachments' => null, // Will be handled separately if needed
            'admin_notes' => $this->faker->boolean(30) ? $this->faker->paragraph() : null,
        ];
    }

    /**
     * Create a pending incident report.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'admin_notes' => null,
        ]);
    }

    /**
     * Create an incident report under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
            'admin_notes' => $this->faker->paragraph(),
        ]);
    }

    /**
     * Create a resolved incident report.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'admin_notes' => $this->faker->paragraphs(2, true),
        ]);
    }

    /**
     * Create an incident report with attachments.
     */
    public function withAttachments(): static
    {
        return $this->state(fn (array $attributes) => [
            'attachments' => [
                [
                    'name' => 'incident_photo_1.jpg',
                    'path' => 'incident-attachments/sample_photo_1.jpg',
                    'type' => 'image/jpeg',
                ],
                [
                    'name' => 'security_video.mp4',
                    'path' => 'incident-attachments/sample_video.mp4',
                    'type' => 'video/mp4',
                ],
            ],
        ]);
    }
}