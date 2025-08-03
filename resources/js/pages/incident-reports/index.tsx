import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
}

interface IncidentReport {
    id: number;
    title: string;
    description: string;
    status: string;
    incident_time: string;
    location_name?: string;
    user: User;
    created_at: string;
}

interface PaginatedData {
    data: IncidentReport[];
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    incidentReports: PaginatedData;
    guards: User[];
    filters: {
        search?: string;
        user_id?: string;
        start_date?: string;
        end_date?: string;
        status?: string;
    };
    canManage: boolean;
    [key: string]: unknown;
}

export default function IncidentReportsIndex({ incidentReports, guards, filters, canManage }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState(filters.user_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get('/incident-reports', {
            search: search || undefined,
            user_id: selectedUser || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            status: status || undefined,
        }, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedUser('');
        setStartDate('');
        setEndDate('');
        setStatus('');
        router.get('/incident-reports', {}, { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'under_review': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'resolved', label: 'Resolved' },
    ];

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📋 Incident Reports
                        </h1>
                        <p className="text-gray-600">
                            {canManage ? 'Manage and review all incident reports' : 'View your submitted incident reports'}
                        </p>
                    </div>
                    {!canManage && (
                        <Link
                            href="/incident-reports/create"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🚨 New Report
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search incidents..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {canManage && guards.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guard</label>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Guards</option>
                                    {guards.map(guard => (
                                        <option key={guard.id} value={guard.id}>{guard.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700">
                            🔍 Filter
                        </Button>
                        <Button onClick={handleClearFilters} variant="outline">
                            🗑️ Clear
                        </Button>
                    </div>
                </div>

                {/* Reports List */}
                <div className="bg-white rounded-lg shadow-md border">
                    {incidentReports.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Incident
                                            </th>
                                            {canManage && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Guard
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {incidentReports.data.map((report) => (
                                            <tr key={report.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {report.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {report.description}
                                                        </div>
                                                    </div>
                                                </td>
                                                {canManage && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {report.user.name}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {report.location_name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(report.incident_time).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                                        {report.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={`/incident-reports/${report.id}`}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        View
                                                    </Link>
                                                    {(canManage || report.status === 'pending') && (
                                                        <Link
                                                            href={`/incident-reports/${report.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {incidentReports.last_page > 1 && (
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {((incidentReports.current_page - 1) * incidentReports.per_page) + 1} to{' '}
                                            {Math.min(incidentReports.current_page * incidentReports.per_page, incidentReports.total)} of{' '}
                                            {incidentReports.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {incidentReports.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">📋</span>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No incident reports found</h3>
                            <p className="text-gray-500 mb-4">
                                {canManage ? 'No incident reports match your current filters.' : 'You haven\'t submitted any incident reports yet.'}
                            </p>
                            {!canManage && (
                                <Link
                                    href="/incident-reports/create"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    🚨 Submit First Report
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}