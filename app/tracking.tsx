import { LocationTracker } from '@/modules/tracking/components/LocationTracker';
import { useTripStore } from '@/modules/tracking/stores/useTripStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function TrackingScreen() {
    const router = useRouter();
    const { tripData } = useTripStore();

    useEffect(() => {
        console.log(tripData, 'tripData')
        if (!tripData) {
            router.replace('/'); // redirect if no trip data
        }
    }, [tripData]);

    if (!tripData) return null;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LocationTracker tripData={tripData} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },
});
