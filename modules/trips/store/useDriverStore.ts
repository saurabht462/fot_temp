import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { LocationPoint, Trip, TripMetadata } from '../types/trip.types';

interface TripState {
    activeTrip: Trip | null;
    pastTrips: Trip[];

    // Actions
    startTrip: (vehicleId: string, startLocation: { lat: number; lon: number }) => void;
    addLocation: (location: LocationPoint) => void;
    pauseTrip: () => void;
    resumeTrip: () => void;
    updateMetadata: (metadata: Partial<TripMetadata>) => void;
    endTrip: (endLocation: { lat: number; lon: number }) => Promise<void>;
    loadPastTrips: () => Promise<void>;
    clearTrips: () => Promise<void>;
}

const TRIPS_STORAGE_KEY = '@trips';

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const useTripStore = create<TripState>((set, get) => ({
    activeTrip: null,
    pastTrips: [],

    startTrip: (vehicleId: string, startLocation: { lat: number; lon: number }) => {
        const newTrip: Trip = {
            id: Date.now().toString(),
            vehicleId,
            startTime: Date.now(),
            startLocation,
            locations: [],
            distance: 0,
            duration: 0,
            avgSpeed: 0,
            maxSpeed: 0,
            metadata: {},
            status: 'active',
        };

        set({ activeTrip: newTrip });
        console.log('🚀 Trip started:', newTrip.id);
    },

    addLocation: (location: LocationPoint) => {
        const { activeTrip } = get();
        if (!activeTrip || activeTrip.status !== 'active') return;

        const updatedLocations = [...activeTrip.locations, location];

        // Calculate distance
        let totalDistance = activeTrip.distance;
        if (activeTrip.locations.length > 0) {
            const lastLocation = activeTrip.locations[activeTrip.locations.length - 1];
            const segmentDistance = calculateDistance(
                lastLocation.latitude,
                lastLocation.longitude,
                location.latitude,
                location.longitude
            );
            totalDistance += segmentDistance;
        }

        // Calculate duration
        const duration = Math.floor((Date.now() - activeTrip.startTime) / 1000);

        // Calculate speeds
        const speeds = updatedLocations.map(loc => loc.speed).filter(s => s > 0);
        const avgSpeed = speeds.length > 0
            ? speeds.reduce((a, b) => a + b, 0) / speeds.length
            : 0;
        const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

        set({
            activeTrip: {
                ...activeTrip,
                locations: updatedLocations,
                distance: totalDistance,
                duration,
                avgSpeed,
                maxSpeed,
            },
        });
    },

    pauseTrip: () => {
        const { activeTrip } = get();
        if (!activeTrip) return;

        set({
            activeTrip: { ...activeTrip, status: 'paused' },
        });
        console.log('⏸️ Trip paused');
    },

    resumeTrip: () => {
        const { activeTrip } = get();
        if (!activeTrip) return;

        set({
            activeTrip: { ...activeTrip, status: 'active' },
        });
        console.log('▶️ Trip resumed');
    },

    updateMetadata: (metadata: Partial<TripMetadata>) => {
        const { activeTrip } = get();
        if (!activeTrip) return;

        set({
            activeTrip: {
                ...activeTrip,
                metadata: { ...activeTrip.metadata, ...metadata },
            },
        });
        console.log('📝 Metadata updated:', metadata);
    },

    endTrip: async (endLocation: { lat: number; lon: number }) => {
        const { activeTrip, pastTrips } = get();
        if (!activeTrip) return;

        const completedTrip: Trip = {
            ...activeTrip,
            endTime: Date.now(),
            endLocation,
            status: 'completed',
        };

        const updatedPastTrips = [completedTrip, ...pastTrips];

        // Save to AsyncStorage
        try {
            await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedPastTrips));
            console.log('💾 Trip saved to storage');
        } catch (error) {
            console.error('Failed to save trip:', error);
        }

        set({
            activeTrip: null,
            pastTrips: updatedPastTrips,
        });

        console.log('✅ Trip completed:', completedTrip.id);
    },

    loadPastTrips: async () => {
        try {
            const stored = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
            if (stored) {
                const trips = JSON.parse(stored);
                set({ pastTrips: trips });
                console.log(`📚 Loaded ${trips.length} past trips`);
            }
        } catch (error) {
            console.error('Failed to load trips:', error);
        }
    },

    clearTrips: async () => {
        try {
            await AsyncStorage.removeItem(TRIPS_STORAGE_KEY);
            set({ pastTrips: [] });
            console.log('🗑️ All trips cleared');
        } catch (error) {
            console.error('Failed to clear trips:', error);
        }
    },
}));