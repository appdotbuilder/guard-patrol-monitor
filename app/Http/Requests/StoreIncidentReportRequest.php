<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncidentReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'location_name' => 'nullable|string|max:255',
            'incident_time' => 'required|date',
            'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,gif,mp4,mov,avi',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Incident title is required.',
            'description.required' => 'Incident description is required.',
            'latitude.required' => 'Location latitude is required.',
            'longitude.required' => 'Location longitude is required.',
            'incident_time.required' => 'Incident time is required.',
            'attachments.*.max' => 'Each file must be smaller than 10MB.',
            'attachments.*.mimes' => 'Only images and videos are allowed.',
        ];
    }
}