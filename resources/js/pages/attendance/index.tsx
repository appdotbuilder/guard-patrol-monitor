import React from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface AttendanceRecord {
    id: number;
    check_in_time: string;
    check_out_time?: string;
    location_name?: string;
    latitude: number;
    longitude: number;
}

interface PaginatedData {
    data: AttendanceRecord[];
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
    attendanceRecords: PaginatedData;
    [key: string]: unknown;
}

export default function AttendanceIndex({ attendanceRecords }: Props) {
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

    const formatDuration = (checkIn: string, checkOut?: string) => {
        if (!checkOut) return 'In Progress';
        
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${diffHours}h ${diffMinutes}m`;
    };

    const todayRecord = attendanceRecords.data.find(record => 
        new Date(record.check_in_time).toDateString() === new Date().toDateString()
    );

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📅 Attendance Records
                        </h1>
                        <p className="text-gray-600">
                            Track your check-in and check-out times with location verification
                        </p>
                    </div>
                    {!todayRecord && (
                        <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                            📍 Check In Now
                        </Button>
                    )}
                </div>

                {/* Today's Status */}
                {todayRecord && (
                    <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">🕐 Today's Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Check-in Time</p>
                                <p className="text-lg text-gray-900">
                                    {new Date(todayRecord.check_in_time).toLocaleTimeString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Check-out Time</p>
                                <p className="text-lg text-gray-900">
                                    {todayRecord.check_out_time 
                                        ? new Date(todayRecord.check_out_time).toLocaleTimeString()
                                        : 'Not checked out'
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Duration</p>
                                <p className="text-lg text-gray-900">
                                    {formatDuration(todayRecord.check_in_time, todayRecord.check_out_time)}
                                </p>
                            </div>
                        </div>
                        {!todayRecord.check_out_time && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <Button 
                                    onClick={() => router.patch(`/attendance/${todayRecord.id}`)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    🏁 Check Out
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Attendance History */}
                <div className="bg-white rounded-lg shadow-md border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">📊 Attendance History</h2>
                    </div>
                    
                    {attendanceRecords.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Check-in Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Check-out Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Duration
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {attendanceRecords.data.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(record.check_in_time).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(record.check_in_time).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.check_out_time 
                                                        ? new Date(record.check_out_time).toLocaleTimeString()
                                                        : '-'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDuration(record.check_in_time, record.check_out_time)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.location_name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        record.check_out_time 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {record.check_out_time ? 'Completed' : 'Active'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {attendanceRecords.last_page > 1 && (
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {((attendanceRecords.current_page - 1) * attendanceRecords.per_page) + 1} to{' '}
                                            {Math.min(attendanceRecords.current_page * attendanceRecords.per_page, attendanceRecords.total)} of{' '}
                                            {attendanceRecords.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {attendanceRecords.links.map((link, index) => (
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
                            <span className="text-6xl mb-4 block">📅</span>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
                            <p className="text-gray-500 mb-4">
                                Start tracking your attendance by checking in for your first shift.
                            </p>
                            <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                                📍 Check In Now
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}