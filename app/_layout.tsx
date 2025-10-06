import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6B2D5C',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Login',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="trip-form"
                options={{
                    title: 'Trip Details',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="tracking"
                options={{
                    title: 'Active Trip',
                    headerShown: true,
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name="confirm"
                options={{
                    title: 'Confirm Trip',
                    headerShown: true,
                    headerBackVisible: false
                }}
            />
        </Stack>
    );
}