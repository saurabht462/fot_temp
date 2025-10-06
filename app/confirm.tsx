import { useTripStore } from '@/modules/tracking/stores/useTripStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ConfirmTripScreen() {
    const router = useRouter();
    const { tripData, setTripData, updateField } = useTripStore();

    const handleConfirm = () => {
        Alert.alert(
            'Trip Completed',
            'Your trip has been saved successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => router.replace('/'),
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Complete Trip</Text>
            <Text style={styles.subtitle}>Confirm the trip details to complete</Text>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Route Name / ID</Text>
                <TextInput
                    style={styles.summaryInput}
                    value={tripData?.routeName}
                    onChangeText={(text) => updateField('routeName', text)}
                />

                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Distance</Text>
                        <TextInput
                            style={styles.summaryInput}
                            value={tripData?.distance}
                            onChangeText={(text) => updateField('distance', text)}
                        />
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Duration</Text>
                        <TextInput
                            style={styles.summaryInput}
                            value={tripData?.duration}
                            onChangeText={(text) => updateField('duration', text)}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                    style={styles.input}
                    value={tripData?.city}
                    onChangeText={(text) => updateField('city', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Driver Name</Text>
                <TextInput
                    style={styles.input}
                    value={tripData?.driverName}
                    onChangeText={(text) => updateField('driverName', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Co-Driver Name</Text>
                <TextInput
                    style={styles.input}
                    value={tripData?.coDriverName}
                    onChangeText={(text) => updateField('coDriverName', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Weather Condition</Text>
                <TextInput
                    style={styles.input}
                    value={tripData?.weatherCondition}
                    onChangeText={(text) => updateField('weatherCondition', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Road Type</Text>
                <TextInput
                    style={styles.input}
                    value={tripData?.roadType}
                    onChangeText={(text) => updateField('roadType', text)}
                />
            </View>

            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm & Complete Trip</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 25, elevation: 2 },
    summaryLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    summaryInput: { fontSize: 16, color: '#333', backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryItem: { flex: 1, marginRight: 12 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, color: '#333' },
    confirmButton: { backgroundColor: '#6B2D5C', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
