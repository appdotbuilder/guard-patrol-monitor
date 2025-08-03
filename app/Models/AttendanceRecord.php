<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AttendanceRecord
 *
 * @property int $id
 * @property int $user_id
 * @property float $latitude
 * @property float $longitude
 * @property string|null $location_name
 * @property \Illuminate\Support\Carbon $check_in_time
 * @property \Illuminate\Support\Carbon|null $check_out_time
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereCheckInTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereCheckOutTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereLocationName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereUserId($value)
 * @method static \Database\Factories\AttendanceRecordFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class AttendanceRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'location_name',
        'check_in_time',
        'check_out_time',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
    ];

    /**
     * Get the user that owns the attendance record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}