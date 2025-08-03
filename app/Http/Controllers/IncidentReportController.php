<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncidentReportRequest;
use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = IncidentReport::with('user')
            ->latest('incident_time');

        // Filter by user if not an admin/superadmin
        if (!auth()->user()->canManageIncidents()) {
            $query->where('user_id', auth()->id());
        }

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('incident_time', [
                $request->start_date,
                $request->end_date . ' 23:59:59'
            ]);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $incidentReports = $query->paginate(10)->withQueryString();
        
        $guards = auth()->user()->canManageIncidents() 
            ? User::guards()->select('id', 'name')->get()
            : [];

        return Inertia::render('incident-reports/index', [
            'incidentReports' => $incidentReports,
            'guards' => $guards,
            'filters' => $request->only(['search', 'user_id', 'start_date', 'end_date', 'status']),
            'canManage' => auth()->user()->canManageIncidents(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('incident-reports/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIncidentReportRequest $request)
    {
        $attachments = [];
        
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('incident-attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getMimeType(),
                ];
            }
        }

        IncidentReport::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_name' => $request->location_name,
            'incident_time' => $request->incident_time,
            'attachments' => $attachments,
        ]);

        return redirect()->route('incident-reports.index')
            ->with('success', 'Incident report submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(IncidentReport $incidentReport)
    {
        // Check authorization
        if (!auth()->user()->canManageIncidents() && $incidentReport->user_id !== auth()->id()) {
            abort(403);
        }

        $incidentReport->load('user');

        return Inertia::render('incident-reports/show', [
            'incidentReport' => $incidentReport,
            'canManage' => auth()->user()->canManageIncidents(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IncidentReport $incidentReport)
    {
        // Only allow editing own reports for guards
        if (!auth()->user()->canManageIncidents() && $incidentReport->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('incident-reports/edit', [
            'incidentReport' => $incidentReport,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncidentReport $incidentReport)
    {
        // Admins can update status and notes
        if (auth()->user()->canManageIncidents()) {
            $incidentReport->update($request->only(['status', 'admin_notes']));
            
            return redirect()->route('incident-reports.show', $incidentReport)
                ->with('success', 'Incident report updated successfully.');
        }

        // Guards can only update their own reports if pending
        if ($incidentReport->user_id === auth()->id() && $incidentReport->status === 'pending') {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'incident_time' => 'required|date',
            ]);

            $incidentReport->update($validated);
            
            return redirect()->route('incident-reports.show', $incidentReport)
                ->with('success', 'Incident report updated successfully.');
        }

        abort(403);
    }
}