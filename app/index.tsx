import { stopTracking } from '@/services/locationService';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {

    useEffect(() => {
        // kill old bg task running
        stopTracking();
    }, []);
    
    const router = useRouter();

    const handleLogin = () => {
        router.push('/home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Log in Form</Text>
                    <Pressable
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Log in</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6B2D5C',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    logoIcon: {
        fontSize: 60,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    sublabel: {
        fontSize: 14,
        color: '#999',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6B2D5C',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    version: {
        position: 'absolute',
        bottom: 20,
        color: '#fff',
        fontSize: 12,
        opacity: 0.7,
    },
});