<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\IncidentReport;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->canManageIncidents()) {
            // Admin/Superadmin dashboard
            $stats = [
                'total_incidents' => IncidentReport::count(),
                'pending_incidents' => IncidentReport::where('status', 'pending')->count(),
                'total_guards' => \App\Models\User::guards()->count(),
                'recent_incidents' => IncidentReport::with('user')
                    ->latest('incident_time')
                    ->take(5)
                    ->get(),
            ];
        } else {
            // Security Guard dashboard
            $todayAttendance = AttendanceRecord::where('user_id', $user->id)
                ->whereDate('check_in_time', today())
                ->first();

            $stats = [
                'my_incidents' => $user->incidentReports()->count(),
                'pending_incidents' => $user->incidentReports()->where('status', 'pending')->count(),
                'today_attendance' => $todayAttendance,
                'recent_incidents' => $user->incidentReports()
                    ->latest('incident_time')
                    ->take(5)
                    ->get(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'userRole' => $user->role,
        ]);
    }
}