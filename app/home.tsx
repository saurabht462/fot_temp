import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const pastTrips = [
        { id: '1', routeName: 'Route A', distance: '45.2 km', date: '12 Jan 2025' },
        { id: '2', routeName: 'Route B', distance: '32.8 km', date: '11 Jan 2025' },
        { id: '3', routeName: 'Route C', distance: '28.5 km', date: '10 Jan 2025' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Pressable
                        style={styles.newTripButton}
                        onPress={() => router.push('/trip-form')}
                    >
                        <Text style={styles.newTripText}>New trip</Text>
                    </Pressable>

                    {/* Past Trips Section */}
                    <View style={styles.pastTripsSection}>
                        <Text style={styles.sectionTitle}>Past trips</Text>

                        {pastTrips.map((trip) => (
                            <View key={trip.id} style={styles.tripCard}>
                                <View style={styles.tripHeader}>
                                    <Text style={styles.tripTitle}>Route Name</Text>
                                    <Text style={styles.tripDate}>{trip.date}</Text>
                                </View>
                                <Text style={styles.tripName}>{trip.routeName}</Text>
                                <View style={styles.tripFooter}>
                                    <Text style={styles.tripDetail}>Distance covered</Text>
                                    <Text style={styles.tripValue}>{trip.distance}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // extra for Android
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    newTripButton: {
        backgroundColor: '#6B2D5C',
        padding: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        elevation: 3,
    },
    newTripText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },
    pastTripsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    tripCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tripTitle: {
        fontSize: 14,
        color: '#666',
    },
    tripDate: {
        fontSize: 14,
        color: '#999',
    },
    tripName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    tripFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    tripDetail: {
        fontSize: 14,
        color: '#666',
    },
    tripValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
});
