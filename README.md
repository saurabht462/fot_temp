Here’s a clean and well-formatted version of your README with proper sections, code blocks, and descriptions:

---

# Project Name

## Get Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the App

```bash
npx expo start
```

---

## 3. Folder Structure

```
project-root/
│── app/                        # Expo Router entry points (routes only)
│   │── _layout.tsx             # Root layout
│   │── index.tsx               # Home (/)
│   │── auth/
│   │   │── index.tsx           # /auth
│   │   │── login.tsx           # /auth/login
│   │   │── signup.tsx          # /auth/signup
│   │── settings/
│       │── index.tsx           # /settings
│
│── modules/                    # Feature-based modules (scalable)
│   │── auth/
│   │   │── components/
│   │   │   │── LoginForm.tsx
│   │   │   │── SignupForm.tsx
│   │   │── hooks/
│   │   │   │── useAuth.ts
│   │   │── services/
│   │   │   │── authService.ts
│   │   │── store/
│   │   │   │── useAuthStore.ts
│   │   │── validation/
│   │   │   │── authSchema.ts
│   │   │── index.ts            # Barrel export for auth module
│   │
│   │── settings/               # Future feature (similar structure)
│
│── components/                 # Global reusable UI components
│   │── Button.tsx
│   │── Loader.tsx
│   │── ErrorBoundary.tsx
│
│── hooks/                      # Global hooks
│   │── useTheme.ts
│   │── useNetwork.ts
│
│── store/                      # Global state management (Zustand/Redux/etc.)
│   │── useThemeStore.ts
│
│── services/                   # Cross-module/shared services (API, Firebase, etc.)
│   │── apiClient.ts
│   │── logger.ts
│
│── utils/                      # Helpers/utilities
│   │── formatDate.ts
│   │── validateEmail.ts
│   │── constants.ts
│
│── localization/               # i18n files
│   │── en.json
│   │── es.json
│
│── env/                        # Environment configs
│   │── .env.dev
│   │── .env.prod
│   │── .env.staging
│
│── tests/                      # Testing setup
│   │── unit/
│   │── e2e/
│   │── jest.setup.ts
│
│── husky/                      # Git hooks
│
│── app.config.ts               # Expo app config
│── tsconfig.json
│── package.json
│── README.md
```

---

## 4. Device Background Location Example

This example demonstrates how to track user location in the background using **Expo Location** and **AsyncStorage**.

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

const LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
    if (error) {
        console.error(error);
        return;
    }
    if (data) {
        const { locations } = data;
        const location = locations[0];
        const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            speed: location.coords.speed,
            timestamp: new Date(location.timestamp).toISOString(),
        };
        const stored = (await AsyncStorage.getItem('locations')) || '[]';
        const arr = JSON.parse(stored);
        arr.push(newLocation);
        await AsyncStorage.setItem('locations', JSON.stringify(arr));
        console.log('[BACKGROUND]', newLocation);
    }
});

export default function App() {
    const [locations, setLocations] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const { status: foreground } = await Location.requestForegroundPermissionsAsync();
            if (foreground === 'granted') {
                const { status: background } = await Location.requestBackgroundPermissionsAsync();
                if (background === 'granted') {
                    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
                        accuracy: Location.Accuracy.BestForNavigation,
                        distanceInterval: 0,
                        timeInterval: 1000,
                        showsBackgroundLocationIndicator: true,
                        foregroundService: {
                            notificationTitle: 'Location Active',
                            notificationBody: 'Tracking your location',
                        },
                    });
                }
            }

            const stored = (await AsyncStorage.getItem('locations')) || '[]';
            setLocations(JSON.parse(stored));

            const interval = setInterval(async () => {
                const stored = (await AsyncStorage.getItem('locations')) || '[]';
                setLocations(JSON.parse(stored));
            }, 2000);

            return () => clearInterval(interval);
        })();
    }, []);

    const clearLocations = async () => {
        await AsyncStorage.removeItem('locations');
        setLocations([]);
    };

    return (
        <View style={{ flex: 1, padding: 20, paddingTop: 50 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Background Location Test (Expo)
            </Text>
            <Button title="Clear Locations" onPress={clearLocations} />
            <ScrollView style={{ marginTop: 20 }}>
                {locations.map((loc, idx) => (
                    <Text key={idx} style={{ marginBottom: 5 }}>
                        {idx + 1}. Lat: {loc.latitude.toFixed(5)}, Lon: {loc.longitude.toFixed(5)}, Speed: {loc.speed || 0} m/s
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}
```

---
**Note:**

* Ensure **foreground** and **background location permissions** are granted.
* Background location works only on **real devices**, not on simulators.
* Data is persisted in **AsyncStorage** and can be cleared with the button.
