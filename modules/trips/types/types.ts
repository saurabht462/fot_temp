export interface LocationPoint {
    latitude: number;
    longitude: number;
    speed: number;
    timestamp: number;
}

export interface TripMetadata {
    routeName?: string;
    city?: string;
    driverName?: string;
    coDriverName?: string;
    weatherCondition?: string;
    roadType?: string;
    temperature?: number;
    roadName?: string;
}

export interface Trip {
    id: string;
    vehicleId: string;

    // Start data
    startTime: number;
    startLocation: { lat: number; lon: number };

    // Tracking data
    locations: LocationPoint[];
    distance: number; // km
    duration: number; // seconds
    avgSpeed: number; // km/h
    maxSpeed: number; // km/h

    // Metadata
    metadata: TripMetadata;

    // End data
    endTime?: number;
    endLocation?: { lat: number; lon: number };

    status: 'active' | 'paused' | 'completed';
}

export type TripStatus = 'active' | 'paused' | 'completed';