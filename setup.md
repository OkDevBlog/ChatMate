# ChatMate Setup Guide

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. iOS Setup (if developing for iOS)
```bash
cd ios && pod install && cd ..
```

### 3. Configure Environment Variables

Edit `src/config/env.ts` and replace the placeholder values:

```typescript
export const ENV = {
  // Get these from https://supabase.com
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key-here',
  
  // Get this from https://platform.openai.com
  OPENAI_API_KEY: 'sk-your-openai-key-here',
  
  // ... rest of config
};
```

### 4. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create tables and policies

### 5. Configure Permissions

#### Android (`android/app/src/main/AndroidManifest.xml`)
Add these permissions inside the `<manifest>` tag:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

#### iOS (`ios/ChatMate/Info.plist`)
Add these permissions inside the `<dict>` tag:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice input</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs access to speech recognition for voice input</string>
```

### 6. Run the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Troubleshooting

### Metro bundler cache issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### iOS build issues
```bash
cd ios && pod install && cd ..
npm run ios
```

### Voice features not working
- Test on a physical device (not simulator)
- Check microphone permissions in device settings
- Ensure internet connection for speech recognition

## Next Steps

1. Test the app on both platforms
2. Customize themes in `src/styles/theme.ts`
3. Add your own branding and colors
4. Configure Stripe for premium features (optional)
5. Deploy to app stores

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure all environment variables are correctly set
3. Verify Supabase database is properly configured
4. Test API keys are valid and have proper permissions