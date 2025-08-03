import React from 'react';
import { Link } from '@inertiajs/react';

interface Props {
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🛡️</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">SecurePatrol</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex space-x-3">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        🛡️ Security Patrol & Monitoring System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Professional security management platform for guard patrol tracking, 
                        incident reporting, and real-time monitoring with geolocation features.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* Attendance Management */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <span className="text-3xl">📍</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Attendance Tracking</h3>
                        <p className="text-gray-600 mb-4">
                            Security guards can check in and out with GPS location verification. 
                            Real-time tracking ensures proper patrol coverage.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• GPS-verified check-ins</li>
                            <li>• Automatic time logging</li>
                            <li>• Location-based verification</li>
                        </ul>
                    </div>

                    {/* Incident Reporting */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                            <span className="text-3xl">🚨</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Incident Reporting</h3>
                        <p className="text-gray-600 mb-4">
                            Comprehensive incident documentation with photos, videos, and 
                            precise location data for thorough reporting.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Photo & video attachments</li>
                            <li>• GPS location stamping</li>
                            <li>• Detailed incident logs</li>
                        </ul>
                    </div>

                    {/* Management Dashboard */}
                    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                            <span className="text-3xl">📊</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Management Tools</h3>
                        <p className="text-gray-600 mb-4">
                            Supervisors and admins get powerful tools to monitor all activities, 
                            filter reports, and manage team performance.
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Advanced filtering & search</li>
                            <li>• Real-time status updates</li>
                            <li>• Performance analytics</li>
                        </ul>
                    </div>
                </div>

                {/* User Roles Section */}
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        👥 User Roles & Permissions
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">👮</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Guards</h3>
                            <p className="text-gray-600 text-sm">
                                Record attendance, submit incident reports with attachments, 
                                and manage personal patrol logs.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">👔</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Supervisors</h3>
                            <p className="text-gray-600 text-sm">
                                Monitor team activities, review incident reports, 
                                and update report statuses with admin notes.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">⭐</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Superadmins</h3>
                            <p className="text-gray-600 text-sm">
                                Full system access, user management, comprehensive reporting, 
                                and complete oversight capabilities.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Screenshots/Demo Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        📱 Modern Interface Design
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white">
                            <div className="bg-white/20 rounded-lg p-6 mb-4">
                                <div className="h-32 flex items-center justify-center">
                                    <span className="text-6xl">📊</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Dashboard Overview</h3>
                            <p className="text-blue-100">
                                Clean, intuitive dashboard showing key metrics and recent activities
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white">
                            <div className="bg-white/20 rounded-lg p-6 mb-4">
                                <div className="h-32 flex items-center justify-center">
                                    <span className="text-6xl">📝</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Report Management</h3>
                            <p className="text-green-100">
                                Streamlined incident reporting with media attachments and location tracking
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-blue-600 rounded-xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        🚀 Ready to Enhance Your Security Operations?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join modern security teams using SecurePatrol for efficient patrol management 
                        and comprehensive incident tracking.
                    </p>
                    {!auth.user && (
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    )}
                    {auth.user && (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Go to Dashboard →
                        </Link>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2024 SecurePatrol. Professional Security Management System.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}