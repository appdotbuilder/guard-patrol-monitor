import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Props {
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function CreateIncidentReport({ errors = {} }: Props) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        incident_time: '',
        location_name: '',
        latitude: '',
        longitude: '',
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const getCurrentLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                        location_name: 'Current Location'
                    }));
                    setLocationLoading(false);
                },
                () => {
                    alert('Unable to get your location. Please enter coordinates manually.');
                    setLocationLoading(false);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            setLocationLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });
        
        attachments.forEach((file, index) => {
            submitData.append(`attachments[${index}]`, file);
        });

        router.post('/incident-reports', submitData, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            }
        });
    };

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🚨 Report New Incident
                    </h1>
                    <p className="text-gray-600">
                        Submit a detailed incident report with location and supporting evidence
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border p-6">
                    {/* Basic Information */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Incident Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
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
                                    placeholder="Brief description of the incident"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div className="md:col-span-2">
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
                                    placeholder="Provide a detailed description of what happened, including any relevant circumstances..."
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

                    {/* Location Information */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Location Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-3">
                                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location Name
                                </label>
                                <input
                                    type="text"
                                    id="location_name"
                                    name="location_name"
                                    value={formData.location_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Main Entrance, Parking Lot A, Building 2"
                                />
                                {errors.location_name && <p className="mt-1 text-sm text-red-600">{errors.location_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="latitude"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 40.7128"
                                />
                                {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
                            </div>

                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="longitude"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., -74.0060"
                                />
                                {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={locationLoading}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {locationLoading ? '⏳ Getting Location...' : '📍 Use Current Location'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📎 Attachments</h2>
                        
                        <div>
                            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
                                Photos & Videos
                            </label>
                            <input
                                type="file"
                                id="attachments"
                                name="attachments"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Upload photos or videos related to the incident. Maximum 10MB per file.
                            </p>
                            {errors.attachments && <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>}
                            
                            {attachments.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {attachments.map((file, index) => (
                                            <li key={index} className="flex items-center space-x-2">
                                                <span>📄</span>
                                                <span>{file.name} ({Math.round(file.size / 1024)}KB)</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get('/incident-reports')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            🚨 Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}