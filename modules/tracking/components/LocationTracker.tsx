import { requestPermissions, startTracking, stopTracking } from '@/services/locationService';
import getDistanceFromLatLonInKm from '@/utils/geo';
import { formatDuration } from '@/utils/time';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTripStore } from '../stores/useTripStore';

interface Props {
    tripData: {
        routeName: string;
        city: string;
        driverName: string;
        coDriverName: string;
        weatherCondition: string;
        roadType: string;
    };
}

export function LocationTracker({ tripData }: Props) {
    const router = useRouter();
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const totalDistanceRef = useRef(0);
    const watcherRef = useRef<Location.LocationSubscription | null>(null);
    const startTimeRef = useRef<Date | null>(new Date());
    const prevLocationRef = useRef<Location.LocationObject | null>(null);
    const [currentLoc, setCurrentLoc] = useState({
        latitude: 0,
        longitude: 0,
        speed: '0 km/h'
    });
    const { tripData: storeTrip, setTripData, updateField } = useTripStore();

    const stopLocationTracking = () => {
        if (watcherRef.current) {
            watcherRef.current.remove();
            watcherRef.current = null;
        }
        stopTracking();
    };

    useEffect(() => {
        (async () => {
            try {
                const granted = await requestPermissions();
                if (!granted) {
                    Alert.alert('Permission Required', 'Enable location permissions in Settings.');
                    return;
                }

                await startTracking();

                setTripData({
                    ...tripData,
                    distance: '0 km',
                    duration: '00:00:00'
                });

                watcherRef.current = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5,
                        timeInterval: 1000,
                    },
                    (loc) => {
                        console.log('inside foreground');
                        let newDistance = totalDistanceRef.current;
                        if (prevLocationRef.current) {
                            const dist = getDistanceFromLatLonInKm(
                                prevLocationRef.current.coords.latitude,
                                prevLocationRef.current.coords.longitude,
                                loc.coords.latitude,
                                loc.coords.longitude
                            );
                            newDistance += dist;
                            totalDistanceRef.current = newDistance;
                        }

                        prevLocationRef.current = loc;

                        const durationStr = formatDuration(startTimeRef.current, new Date());
                        const speedStr = loc.coords.speed ? (loc.coords.speed * 3.6).toFixed(1) + ' km/h' : '0 km/h';

                        setCurrentLoc({
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude,
                            speed: speedStr
                        });

                        updateField('distance', newDistance.toFixed(2) + ' km');
                        updateField('duration', durationStr);
                    }
                );

            } catch (err) {
                console.error(err);
                Alert.alert('Error', String(err));
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            stopLocationTracking();
        };
    }, []);

    const handleCompleteTrip = () => {
        Alert.alert(
            'Confirm Trip Completion',
            'Are you sure you want to complete this trip?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: () => {
                        stopLocationTracking();
                        router.push('/confirm');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Initializing tracking...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.statusBanner}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Trip Active</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Speed</Text>
                    <Text style={styles.statValue}>{currentLoc.speed}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{storeTrip?.distance || '0 km'}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statValue}>{storeTrip?.duration || '00:00:00'}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Temperature</Text>
                    <Text style={styles.statValue}>31°C</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Latitude</Text>
                    <Text style={styles.statValue}>{currentLoc.latitude.toFixed(6)}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Longitude</Text>
                    <Text style={styles.statValue}>{currentLoc.longitude.toFixed(6)}</Text>
                </View>
            </View>

            <View style={styles.detailsCard}>
                <View style={styles.detailsHeader}>
                    <Text style={styles.detailsTitle}>Trip details - Metadata</Text>
                    <Pressable onPress={() => setShowEditModal(true)}>
                        <Text style={styles.editButton}>Edit</Text>
                    </Pressable>
                </View>
                {storeTrip && Object.entries(storeTrip).map(([key, value]) => (
                    ['distance', 'duration', 'speed', 'latitude', 'longitude', 'temperature'].includes(key) ? null : (
                        <View style={styles.detailRow} key={key}>
                            <Text style={styles.detailLabel}>{`${key[0].toUpperCase() + key.slice(1)}: ${value}`}</Text>
                        </View>
                    )
                ))}
            </View>

            <View style={styles.actionButtons}>
                <Pressable style={styles.pauseButton}>
                    <Text style={styles.pauseText}>Pause</Text>
                </Pressable>
                <Pressable
                    style={styles.completeButton}
                    onPress={handleCompleteTrip}
                >
                    <Text style={styles.completeText}>Complete trip</Text>
                </Pressable>
            </View>

            <Modal
                visible={showEditModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Trip Details</Text>
                        <Text style={styles.modalSubtitle}>Update metadata during trip</Text>
                        <Pressable
                            style={styles.modalCloseButton}
                            onPress={() => setShowEditModal(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
    statusBanner: { backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50', marginRight: 8 },
    statusText: { fontSize: 16, fontWeight: '600', color: '#333' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 8, marginHorizontal: 6, elevation: 2 },
    statLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    detailsCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginTop: 10, marginBottom: 20, elevation: 2 },
    detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    detailsTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
    editButton: { fontSize: 14, color: '#6B2D5C', fontWeight: '600' },
    detailRow: { paddingVertical: 8 },
    detailLabel: { fontSize: 14, color: '#666' },
    actionButtons: { flexDirection: 'row', gap: 12 },
    pauseButton: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
    pauseText: { fontSize: 16, fontWeight: '600', color: '#333' },
    completeButton: { flex: 1, backgroundColor: '#6B2D5C', padding: 16, borderRadius: 8, alignItems: 'center' },
    completeText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 30, width: '85%', maxHeight: '70%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    modalCloseButton: { backgroundColor: '#6B2D5C', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    modalCloseText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});