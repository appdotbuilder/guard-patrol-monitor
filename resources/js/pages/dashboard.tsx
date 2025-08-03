import React from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface AttendanceRecord {
    id: number;
    check_in_time: string;
    check_out_time?: string;
    location_name?: string;
}

interface IncidentReport {
    id: number;
    title: string;
    status: string;
    incident_time: string;
    user?: {
        name: string;
    };
}

interface Stats {
    total_incidents?: number;
    pending_incidents?: number;
    total_guards?: number;
    my_incidents?: number;
    today_attendance?: AttendanceRecord;
    recent_incidents: IncidentReport[];
}

interface Props {
    stats: Stats;
    userRole: string;
    success?: string;
    [key: string]: unknown;
}

export default function Dashboard({ stats, userRole, success }: Props) {
    const isGuard = userRole === 'user';
    const canManage = ['admin', 'superadmin'].includes(userRole);

    const handleCheckIn = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    router.post('/attendance', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        location_name: 'Current Location'
                    });
                },
                () => {
                    alert('Please enable location services to check in.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleCheckOut = () => {
        if (stats.today_attendance) {
            router.patch(`/attendance/${stats.today_attendance.id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'under_review': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isGuard ? '🛡️ Security Dashboard' : '👔 Management Dashboard'}
                    </h1>
                    <p className="text-gray-600">
                        {isGuard 
                            ? 'Manage your patrol activities and incident reports'
                            : 'Monitor security operations and manage incident reports'
                        }
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {canManage && (
                        <>
                            <div className="bg-white rounded-lg p-6 shadow-md border">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total_incidents}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-md border">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending_incidents}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-md border">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">👮</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Security Guards</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total_guards}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {isGuard && (
                        <>
                            <div className="bg-white rounded-lg p-6 shadow-md border">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">My Reports</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.my_incidents}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-md border">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending_incidents}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Attendance Status for Guards */}
                    {isGuard && (
                        <div className="bg-white rounded-lg p-6 shadow-md border col-span-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Today's Attendance</p>
                                    {stats.today_attendance ? (
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Checked in: {new Date(stats.today_attendance.check_in_time).toLocaleTimeString()}
                                            </p>
                                            {stats.today_attendance.check_out_time && (
                                                <p className="text-sm text-gray-600">
                                                    Checked out: {new Date(stats.today_attendance.check_out_time).toLocaleTimeString()}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Not checked in yet</p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    {!stats.today_attendance && (
                                        <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                                            📍 Check In
                                        </Button>
                                    )}
                                    {stats.today_attendance && !stats.today_attendance.check_out_time && (
                                        <Button onClick={handleCheckOut} className="bg-red-600 hover:bg-red-700">
                                            🏁 Check Out
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {isGuard && (
                        <Link
                            href="/incident-reports/create"
                            className="bg-white rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow block"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🚨</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Report Incident</h3>
                                    <p className="text-sm text-gray-600">Submit a new incident report</p>
                                </div>
                            </div>
                        </Link>
                    )}
                    
                    <Link
                        href="/incident-reports"
                        className="bg-white rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow block"
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {isGuard ? 'My Reports' : 'All Reports'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {isGuard ? 'View your incident reports' : 'Manage all incident reports'}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {isGuard && (
                        <Link
                            href="/attendance"
                            className="bg-white rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow block"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
                                    <p className="text-sm text-gray-600">View your attendance records</p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Recent Incidents */}
                <div className="bg-white rounded-lg shadow-md border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            📋 Recent Incidents
                        </h2>
                    </div>
                    <div className="p-6">
                        {stats.recent_incidents.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recent_incidents.map((incident) => (
                                    <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{incident.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {canManage && incident.user && `By ${incident.user.name} • `}
                                                {new Date(incident.incident_time).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                                                {incident.status.replace('_', ' ')}
                                            </span>
                                            <Link
                                                href={`/incident-reports/${incident.id}`}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-4 block">📝</span>
                                <p className="text-gray-500">No recent incidents</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}