// store/tripStore.ts
import { create } from 'zustand';

export interface TripData {
    routeName: string;
    city: string;
    driverName: string;
    coDriverName: string;
    weatherCondition: string;
    roadType: string;
    distance: string;
    duration: string;
}

interface TripStore {
    tripData: TripData | null;
    setTripData: (data: TripData) => void;
    updateField: (field: keyof TripData, value: string) => void;
    clearTripData: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
    tripData: null,
    setTripData: (data) => set({ tripData: data }),
    updateField: (field, value) =>
        set((state) => ({
            tripData: state.tripData ? { ...state.tripData, [field]: value } : null,
        })),
    clearTripData: () => set({ tripData: null })
}));
