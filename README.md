# ChatMate - Your On-the-Go AI Companion

A mobile-first AI chatbot app built with React Native CLI, featuring voice input/output, conversation history, and premium features.

## Features

- 🤖 **AI Chat Interface**: Conversational chat with GPT models
- 🎤 **Voice Messaging**: Voice-to-text and text-to-speech capabilities
- 🔐 **Authentication**: Supabase Auth with email/password and guest mode
- 📝 **Chat History**: Save, search, and manage conversations
- 🌙 **Dark/Light Mode**: Customizable themes
- 💎 **Premium Features**: Subscription-based unlimited access (optional)

## Tech Stack

- **Frontend**: React Native CLI + Redux Toolkit
- **AI Backend**: OpenAI API integration
- **Auth & Database**: Supabase Auth + Postgres
- **Voice**: react-native-tts + @react-native-voice/voice
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit

## Prerequisites

- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Supabase account
- OpenAI API key

## Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Install iOS dependencies** (iOS only):
```bash
cd ios && pod install && cd ..
```

3. **Configure environment variables**:

Create your Supabase project and get your credentials:
- Go to [Supabase](https://supabase.com)
- Create a new project
- Go to Settings > API to get your URL and anon key

Update `src/config/supabase.ts`:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

Get your OpenAI API key:
- Go to [OpenAI](https://platform.openai.com)
- Create an API key

Update `src/config/openai.ts`:
```typescript
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
```

4. **Set up Supabase database**:

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor to create the necessary tables and policies.

5. **Configure permissions** (Android):

Add these permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

6. **Configure permissions** (iOS):

Add these permissions to `ios/ChatMate/Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice input</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs access to speech recognition for voice input</string>
```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Start Metro bundler
```bash
npm start
```

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── supabase.ts   # Supabase client setup
│   └── openai.ts     # OpenAI API integration
├── screens/          # Screen components
│   ├── SplashScreen.tsx
│   ├── AuthScreen.tsx
│   ├── ChatScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── store/            # Redux store and slices
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── chatSlice.ts
│       └── settingsSlice.ts
├── styles/           # Theme and styling
│   └── theme.ts
└── types/            # TypeScript type definitions
    └── index.ts
```

## Key Features Implementation

### Authentication
- Email/password authentication via Supabase Auth
- Guest mode for local-only usage
- Automatic session management

### AI Chat
- Direct OpenAI API integration
- Message history with Supabase Postgres
- Real-time typing indicators
- Markdown support for AI responses

### Voice Features
- Voice-to-text using @react-native-voice/voice
- Text-to-speech using react-native-tts
- Visual feedback during recording
- Auto-play AI responses

### Data Management
- Row Level Security (RLS) with Supabase
- Efficient message storage and retrieval
- User-specific chat isolation

## Customization

### Themes
Modify `src/styles/theme.ts` to customize colors, spacing, and typography.

### AI Model
Change the OpenAI model in `src/config/openai.ts`:
```typescript
model: 'gpt-4', // or 'gpt-3.5-turbo'
```

### Voice Settings
Configure TTS and STT settings in the respective screen components.

## Deployment

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
1. Open `ios/ChatMate.xcworkspace` in Xcode
2. Select your team and provisioning profile
3. Archive and upload to App Store Connect

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
```bash
npm start -- --reset-cache
```

2. **Android build issues**:
```bash
cd android && ./gradlew clean && cd ..
```

3. **iOS build issues**:
```bash
cd ios && pod install && cd ..
```

4. **Voice recognition not working**:
- Check microphone permissions
- Ensure device has internet connection
- Test on physical device (not simulator)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.