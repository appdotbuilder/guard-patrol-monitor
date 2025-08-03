<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SecurityPatrolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a superadmin user
        $superAdmin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@securepatrol.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);

        // Create admin/supervisor users
        $admin1 = User::create([
            'name' => 'Security Supervisor',
            'email' => 'supervisor@securepatrol.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $admin2 = User::create([
            'name' => 'Operations Manager',
            'email' => 'manager@securepatrol.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create security guard users
        $guards = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@securepatrol.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@securepatrol.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike.chen@securepatrol.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Lisa Rodriguez',
                'email' => 'lisa.rodriguez@securepatrol.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@securepatrol.com',
                'password' => Hash::make('password'),
            ],
        ];

        $createdGuards = [];
        foreach ($guards as $guardData) {
            $createdGuards[] = User::create([
                ...$guardData,
                'email_verified_at' => now(),
                'role' => 'user',
            ]);
        }

        // Create attendance records for guards
        foreach ($createdGuards as $guard) {
            // Create some historical attendance records
            AttendanceRecord::factory(random_int(10, 20))
                ->for($guard)
                ->completed()
                ->create();

            // Create current shift for some guards (50% chance)
            if (random_int(0, 1)) {
                AttendanceRecord::factory()
                    ->for($guard)
                    ->active()
                    ->create([
                        'check_in_time' => now()->subHours(random_int(1, 8)),
                    ]);
            }
        }

        // Create incident reports
        foreach ($createdGuards as $guard) {
            // Create 3-8 incident reports per guard
            $reportCount = random_int(3, 8);
            
            for ($i = 0; $i < $reportCount; $i++) {
                $status = match (random_int(1, 10)) {
                    1, 2, 3 => 'pending',
                    4, 5, 6, 7 => 'under_review',
                    default => 'resolved',
                };

                IncidentReport::factory()
                    ->for($guard)
                    ->create([
                        'status' => $status,
                        'admin_notes' => in_array($status, ['under_review', 'resolved']) 
                            ? fake()->paragraphs(random_int(1, 2), true)
                            : null,
                    ]);
            }
        }

        // Create some incident reports with attachments
        IncidentReport::factory(5)
            ->for($createdGuards[array_rand($createdGuards)])
            ->withAttachments()
            ->create();

        $this->command->info('Security patrol demo data created successfully!');
        $this->command->info('');
        $this->command->info('Login credentials:');
        $this->command->info('Superadmin: admin@securepatrol.com / password');
        $this->command->info('Supervisor: supervisor@securepatrol.com / password');
        $this->command->info('Manager: manager@securepatrol.com / password');
        $this->command->info('Guards: john.smith@securepatrol.com, sarah.johnson@securepatrol.com, etc. / password');
    }
}