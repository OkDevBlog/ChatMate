# 🚀 Getting Started with ChatMate

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your API Keys
Run the interactive setup:
```bash
npm run setup
```

Or manually edit `src/config/env.ts`:
```typescript
export const ENV = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  OPENAI_API_KEY: 'sk-your-openai-key',
  // ... rest stays the same
};
```

### 3. Set Up Database
1. Go to your Supabase project
2. Open SQL Editor
3. Copy/paste content from `supabase-schema.sql`
4. Run the SQL

### 4. Run the App
```bash
# For Android
npm run android

# For iOS  
npm run ios
```

## 🎯 What You Get

✅ **Complete AI Chat App** with OpenAI integration  
✅ **Voice Input/Output** with speech recognition  
✅ **User Authentication** via Supabase  
✅ **Chat History** with database persistence  
✅ **Dark/Light Themes** with smooth animations  
✅ **Guest Mode** for testing without signup  
✅ **Modern UI** with React Navigation  

## 🔧 Key Features

- **Real-time AI Chat**: Powered by OpenAI GPT models
- **Voice Features**: Speak to chat, hear responses
- **Secure Auth**: Email/password + guest mode
- **Data Persistence**: All chats saved to Supabase
- **Responsive Design**: Works on all screen sizes
- **Theme Support**: Light/dark mode toggle

## 📱 App Structure

```
ChatMate/
├── 🏠 Chat Screen      # Main AI conversation
├── 📝 History Screen   # Past conversations  
└── ⚙️ Settings Screen  # App preferences
```

## 🛠 Customization

### Change AI Model
Edit `src/config/env.ts`:
```typescript
OPENAI_MODEL: 'gpt-4', // or 'gpt-3.5-turbo'
```

### Customize Theme
Edit `src/styles/theme.ts` to change colors, fonts, spacing.

### Add Features
The modular architecture makes it easy to add:
- File sharing
- Image generation  
- Custom AI prompts
- Push notifications
- Premium subscriptions

## 🚨 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Build issues
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS  
cd ios && pod install && cd ..
```

### Voice not working
- Test on physical device (not simulator)
- Check microphone permissions
- Ensure internet connection

## 📞 Support

- Check `README.md` for detailed documentation
- Review `setup.md` for step-by-step setup
- Open GitHub issues for bugs/questions

---

**Ready to chat with AI? Run `npm run android` or `npm run ios` and start building your AI companion! 🤖**