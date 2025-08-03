<?php

namespace Database\Factories;

use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceRecord>
 */
class AttendanceRecordFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\AttendanceRecord>
     */
    protected $model = AttendanceRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkInTime = $this->faker->dateTimeBetween('-30 days', 'now');
        $shouldHaveCheckOut = $this->faker->boolean(80); // 80% chance of having check-out
        
        return [
            'user_id' => User::factory(),
            'latitude' => $this->faker->latitude(-90, 90),
            'longitude' => $this->faker->longitude(-180, 180),
            'location_name' => $this->faker->randomElement([
                'Main Entrance',
                'Parking Lot A',
                'Building 2',
                'Security Office',
                'Reception Area',
                'Emergency Exit',
            ]),
            'check_in_time' => $checkInTime,
            'check_out_time' => $shouldHaveCheckOut 
                ? $this->faker->dateTimeBetween($checkInTime, $checkInTime->format('Y-m-d') . ' 23:59:59')
                : null,
        ];
    }

    /**
     * Create an attendance record without check-out (currently active).
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'check_out_time' => null,
        ]);
    }

    /**
     * Create an attendance record with check-out (completed).
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            $checkInTime = $attributes['check_in_time'] ?? $this->faker->dateTimeBetween('-1 day', 'now');
            
            return [
                'check_out_time' => $this->faker->dateTimeBetween(
                    $checkInTime,
                    is_string($checkInTime) ? $checkInTime . ' +8 hours' : $checkInTime->format('Y-m-d H:i:s') . ' +8 hours'
                ),
            ];
        });
    }
}