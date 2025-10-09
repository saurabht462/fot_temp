import axios from 'axios';
import * as TaskManager from 'expo-task-manager';
import { database } from './db';

export const LOCATION_TASK = 'background-location-task';

const SERVER_URL = 'http://192.168.1.8:3000/api/location';

const axiosInstance = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function sendLocationToServer(locationData: any): Promise<boolean> {
    try {
        await axiosInstance.post(SERVER_URL, locationData);
        console.log('[Server] Sent successfully');
        return true;
    } catch (error) {
        console.warn('[Server] Failed:', axios.isAxiosError(error) ? error.message : error);
        return false;
    }
}

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
    console.log('[BG Task] START', new Date().toISOString());
    
    try {
        if (error || !data?.locations?.length) {
            console.error('[BG Task] Invalid data');
            return;
        }

        const location = data.locations[0];
        
        const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
            heading: location.coords.heading,
            timestamp: new Date(location.timestamp).toISOString(),
        };

        console.log('[BG Task] Location:', locationData.latitude.toFixed(6), locationData.longitude.toFixed(6));

        const serverSuccess = await sendLocationToServer(locationData);
        
        if (!serverSuccess) {
            database.insertLocation(locationData);
            console.log('[BG Task] Stored in DB (server unavailable)');
        }

    } catch (taskError: any) {
        console.error('[BG Task] Error:', taskError.message);
    }
});