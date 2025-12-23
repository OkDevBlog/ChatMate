export default {
    name: 'ChatMate',
    slug: 'chatmate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'chatmate',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#0f172a',
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.chatmate.app',
        infoPlist: {
            NSMicrophoneUsageDescription: 'ChatMate needs microphone access for voice input.',
            NSSpeechRecognitionUsageDescription: 'ChatMate uses speech recognition for voice commands.',
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#0f172a',
        },
        package: 'com.chatmate.app',
        permissions: [
            'android.permission.RECORD_AUDIO',
            'android.permission.MODIFY_AUDIO_SETTINGS',
        ],
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    plugins: [
        'expo-router',
        [
            'expo-av',
            {
                microphonePermission: 'ChatMate needs microphone access for voice input.',
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
        firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        eas: {
            projectId: 'your-eas-project-id',
        },
    },
};
