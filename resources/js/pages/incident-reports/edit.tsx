import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
}

interface IncidentReport {
    id: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    location_name?: string;
    incident_time: string;
    status: string;
    admin_notes?: string;
    user: User;
}

interface Props {
    incidentReport: IncidentReport;
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function EditIncidentReport({ incidentReport, errors = {} }: Props) {
    // For now, we'll determine permissions based on the report status and assume proper server-side validation
    const canManage = true; // This will be properly determined by the server
    const isOwner = true; // This will be properly determined by the server
    
    const [formData, setFormData] = useState({
        title: incidentReport.title,
        description: incidentReport.description,
        incident_time: incidentReport.incident_time.slice(0, 16), // Format for datetime-local
        status: incidentReport.status,
        admin_notes: incidentReport.admin_notes || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData: Record<string, string> = {};
        
        if (canManage) {
            // Admins can update status and notes
            submitData.status = formData.status;
            submitData.admin_notes = formData.admin_notes;
        } else if (isOwner && incidentReport.status === 'pending') {
            // Guards can only update their own pending reports
            submitData.title = formData.title;
            submitData.description = formData.description;
            submitData.incident_time = formData.incident_time;
        }

        router.patch(`/incident-reports/${incidentReport.id}`, submitData);
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'resolved', label: 'Resolved' },
    ];

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ✏️ Edit Incident Report
                    </h1>
                    <p className="text-gray-600">
                        {canManage 
                            ? 'Update incident status and add administrative notes'
                            : 'Modify your incident report details'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border p-6">
                    {/* Guard Fields - Only editable by owner if pending */}
                    {(!canManage && isOwner && incidentReport.status === 'pending') && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Incident Details</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Incident Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Detailed Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div>
                                    <label htmlFor="incident_time" className="block text-sm font-medium text-gray-700 mb-1">
                                        Incident Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="incident_time"
                                        name="incident_time"
                                        value={formData.incident_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.incident_time && <p className="mt-1 text-sm text-red-600">{errors.incident_time}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Fields - Only visible to admins */}
                    {canManage && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">👔 Administrative Controls</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Report Status *
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                <div>
                                    <label htmlFor="admin_notes" className="block text-sm font-medium text-gray-700 mb-1">
                                        Administrative Notes
                                    </label>
                                    <textarea
                                        id="admin_notes"
                                        name="admin_notes"
                                        value={formData.admin_notes}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add notes about the investigation, actions taken, or resolution details..."
                                    />
                                    {errors.admin_notes && <p className="mt-1 text-sm text-red-600">{errors.admin_notes}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Read-only Information */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">📋 Report Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Report ID:</span>
                                <span className="ml-1 text-gray-900">#{incidentReport.id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Submitted by:</span>
                                <span className="ml-1 text-gray-900">{incidentReport.user.name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Current Status:</span>
                                <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${
                                    incidentReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    incidentReport.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {incidentReport.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Location:</span>
                                <span className="ml-1 text-gray-900">
                                    {incidentReport.location_name || `${incidentReport.latitude}, ${incidentReport.longitude}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(`/incident-reports/${incidentReport.id}`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            💾 Save Changes
                        </Button>
                    </div>

                    {/* Permission Notice */}
                    {!canManage && !(isOwner && incidentReport.status === 'pending') && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start">
                                <span className="text-amber-500 text-xl mr-3">⚠️</span>
                                <div>
                                    <h4 className="text-amber-800 font-medium">Limited Edit Access</h4>
                                    <p className="text-amber-700 text-sm mt-1">
                                        This report can no longer be edited as it has been reviewed by management. 
                                        Only administrators can make changes to reports under review or resolved status.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AppShell>
    );
}