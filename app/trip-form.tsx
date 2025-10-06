import { useTripStore } from '@/modules/tracking/stores/useTripStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TripFormScreen() {
    const router = useRouter();
    const { setTripData } = useTripStore();

    const [formData, setFormData] = useState({
        routeName: '',
        city: '',
        driverName: '',
        coDriverName: '',
        weatherCondition: '',
        roadType: '',
        distance: '',
        duration: ''
    });

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleStartTrip = () => {
        if (!formData.routeName || !formData.driverName) {
            Alert.alert('Missing Info', 'Please fill at least Route Name and Driver Name');
            return;
        }

        setTripData(formData);
        router.push('/tracking');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>New trip</Text>
                <Text style={styles.subtitle}>Enter trip details before starting</Text>

                {Object.entries({
                    routeName: 'Route Name / ID',
                    city: 'City',
                    driverName: 'Driver Name',
                    coDriverName: 'Co-Driver Name',
                    weatherCondition: 'Weather condition',
                    roadType: 'Road type',
                }).map(([key, label]) => (
                    <View key={key} style={styles.inputGroup}>
                        <Text style={styles.label}>{label}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            value={formData[key as keyof typeof formData]}
                            onChangeText={(text) => updateField(key, text)}
                        />
                    </View>
                ))}

                <Pressable style={styles.startButton} onPress={handleStartTrip}>
                    <Text style={styles.startButtonText}>Start Trip</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    startButton: {
        backgroundColor: '#6B2D5C',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});