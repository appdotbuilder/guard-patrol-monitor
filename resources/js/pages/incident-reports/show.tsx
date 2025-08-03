import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Attachment {
    name: string;
    path: string;
    type: string;
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
    attachments?: Attachment[];
    user: User;
    created_at: string;
    updated_at: string;
}

interface Props {
    incidentReport: IncidentReport;
    canManage: boolean;
    [key: string]: unknown;
}

export default function ShowIncidentReport({ incidentReport, canManage }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'under_review': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isImage = (type: string) => type.startsWith('image/');
    const isVideo = (type: string) => type.startsWith('video/');

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {incidentReport.title}
                            </h1>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(incidentReport.status)}`}>
                                {incidentReport.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Incident Report #{incidentReport.id}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href="/incident-reports"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            ← Back to Reports
                        </Link>
                        {(canManage || (incidentReport.status === 'pending')) && (
                            <Link
                                href={`/incident-reports/${incidentReport.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                ✏️ Edit
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Incident Details */}
                        <div className="bg-white rounded-lg shadow-md border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Incident Details</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                                    <p className="text-gray-900 whitespace-pre-wrap">{incidentReport.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Incident Date & Time</h3>
                                        <p className="text-gray-900">
                                            {new Date(incidentReport.incident_time).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Reported By</h3>
                                        <p className="text-gray-900">{incidentReport.user.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="bg-white rounded-lg shadow-md border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Location Information</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Location Name</h3>
                                    <p className="text-gray-900">{incidentReport.location_name || 'Not specified'}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Latitude</h3>
                                        <p className="text-gray-900">{incidentReport.latitude}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Longitude</h3>
                                        <p className="text-gray-900">{incidentReport.longitude}</p>
                                    </div>
                                </div>

                                <div>
                                    <a
                                        href={`https://maps.google.com/maps?q=${incidentReport.latitude},${incidentReport.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        🗺️ View on Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {incidentReport.attachments && incidentReport.attachments.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">📎 Attachments</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {incidentReport.attachments.map((attachment, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700 truncate">
                                                    {attachment.name}
                                                </span>
                                                <a
                                                    href={`/storage/${attachment.path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                            
                                            {isImage(attachment.type) && (
                                                <img
                                                    src={`/storage/${attachment.path}`}
                                                    alt={attachment.name}
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                            )}
                                            
                                            {isVideo(attachment.type) && (
                                                <video
                                                    controls
                                                    className="w-full h-32 rounded"
                                                >
                                                    <source src={`/storage/${attachment.path}`} type={attachment.type} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                            
                                            {!isImage(attachment.type) && !isVideo(attachment.type) && (
                                                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                                    <span className="text-4xl">📄</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Notes */}
                        {canManage && incidentReport.admin_notes && (
                            <div className="bg-white rounded-lg shadow-md border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">👔 Admin Notes</h2>
                                <p className="text-gray-900 whitespace-pre-wrap">{incidentReport.admin_notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Report Information */}
                        <div className="bg-white rounded-lg shadow-md border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">ℹ️ Report Information</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Report ID</h3>
                                    <p className="text-gray-900">#{incidentReport.id}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incidentReport.status)}`}>
                                        {incidentReport.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Submitted</h3>
                                    <p className="text-gray-900">
                                        {new Date(incidentReport.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h3>
                                    <p className="text-gray-900">
                                        {new Date(incidentReport.updated_at).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Reported By</h3>
                                    <div>
                                        <p className="text-gray-900">{incidentReport.user.name}</p>
                                        <p className="text-sm text-gray-500">{incidentReport.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
                            
                            <div className="space-y-3">
                                {(canManage || incidentReport.status === 'pending') && (
                                    <Link
                                        href={`/incident-reports/${incidentReport.id}/edit`}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ✏️ Edit Report
                                    </Link>
                                )}
                                
                                <a
                                    href={`https://maps.google.com/maps?q=${incidentReport.latitude},${incidentReport.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    🗺️ View Location
                                </a>
                                
                                <Link
                                    href="/incident-reports"
                                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    📋 All Reports
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}