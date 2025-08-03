<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Only security guards can access attendance
        if (!auth()->user()->isGuard()) {
            abort(403, 'Only security guards can access attendance records.');
        }

        $attendanceRecords = auth()->user()->attendanceRecords()
            ->latest('check_in_time')
            ->paginate(10);
        
        return Inertia::render('attendance/index', [
            'attendanceRecords' => $attendanceRecords
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only security guards can create attendance records
        if (!auth()->user()->isGuard()) {
            abort(403, 'Only security guards can create attendance records.');
        }

        return Inertia::render('attendance/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        // Only security guards can create attendance records
        if (!auth()->user()->isGuard()) {
            abort(403, 'Only security guards can create attendance records.');
        }

        AttendanceRecord::create([
            'user_id' => auth()->id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_name' => $request->location_name,
            'check_in_time' => now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Attendance recorded successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttendanceRecord $attendance)
    {
        // Only security guards can update attendance records
        if (!auth()->user()->isGuard()) {
            abort(403, 'Only security guards can update attendance records.');
        }

        // Ensure user can only update their own records
        if ($attendance->user_id !== auth()->id()) {
            abort(403, 'You can only update your own attendance records.');
        }

        $attendance->update([
            'check_out_time' => now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Check-out recorded successfully!');
    }
}