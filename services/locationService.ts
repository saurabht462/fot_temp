import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK } from './backgroundLocationTask';

export const requestPermissions = async (): Promise<boolean> => {
    let fg = await Location.getForegroundPermissionsAsync();
    if (fg.status !== 'granted') fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== 'granted') return false;

    let bg = await Location.getBackgroundPermissionsAsync();
    if (bg.status !== 'granted') bg = await Location.requestBackgroundPermissionsAsync();
    return bg.status === 'granted';
};

export const startTracking = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
    if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.BestForNavigation, 
        distanceInterval: 5, 
        timeInterval: 5000,  
        deferredUpdatesInterval: 5000, // Batch updates
        showsBackgroundLocationIndicator: true,
        foregroundService: {
            notificationTitle: 'Location Tracking',
            notificationBody: 'Recording your location',
        },
    });
};
export const stopTracking = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
    if (isRegistered) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
};
