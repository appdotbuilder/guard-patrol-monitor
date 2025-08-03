<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\IncidentReport
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property float $latitude
 * @property float $longitude
 * @property string|null $location_name
 * @property \Illuminate\Support\Carbon $incident_time
 * @property array|null $attachments
 * @property string $status
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport query()
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereAdminNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereAttachments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereIncidentTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereLocationName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport pending()
 * @method static \Illuminate\Database\Eloquent\Builder|IncidentReport byDateRange($startDate, $endDate)
 * @method static \Database\Factories\IncidentReportFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class IncidentReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'latitude',
        'longitude',
        'location_name',
        'incident_time',
        'attachments',
        'status',
        'admin_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'incident_time' => 'datetime',
        'attachments' => 'array',
    ];

    /**
     * Get the user that owns the incident report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include pending reports.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('incident_time', [$startDate, $endDate]);
    }
}