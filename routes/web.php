<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncidentReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Attendance Management
    Route::resource('attendance', AttendanceController::class)->only(['index', 'create', 'store', 'update']);

    // Incident Reports
    Route::resource('incident-reports', IncidentReportController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';