# ChatMate - AI Companion Mobile App

> **Think out loud. Get answers. Talk it through.**

A cross-platform AI chatbot mobile app with text & voice conversations, conversation history, and premium features.

![Expo](https://img.shields.io/badge/Expo-SDK%2054-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core Features

- 💬 **AI Chat** - Intelligent conversations powered by Google Gemini
- 🎙️ **Voice Input** - Speak your messages with microphone
- 🔊 **Voice Output** - Listen to AI responses (Text-to-Speech)
- 🧠 **Personality Modes** - Choose Friendly, Professional, or Tutor style
- 📜 **Chat History** - Resume conversations anytime
- 🔐 **Secure Auth** - Firebase authentication with guest mode

### Bonus Features

- 📤 Chat export (Text/Markdown)
- ✏️ Conversation rename
- 🌙 Dark mode
- ⚡ Rate limiting with premium tiers

## 🛠️ Tech Stack

### Mobile App

- **Framework**: Expo (React Native) SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State**: Redux Toolkit
- **Voice**: expo-speech + expo-av

### Backend

- **Framework**: FastAPI (Python)
- **AI**: Google Gemini API (Free!)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Expo Go app (v54) on your device
- Firebase project with Authentication & Firestore enabled
- Google Gemini API key (free at <https://aistudio.google.com/app/apikey>)

### Mobile App Setup

```bash
# Navigate to project
cd ChatMate

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your Firebase config and API URL

# Start development server
npm run start
```

Scan the QR code with Expo Go app.

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Start server (use your local IP for mobile testing)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at <http://localhost:8000/docs>

## 📱 Environment Variables

### Mobile App (.env)

```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### Backend (.env)

```
GEMINI_API_KEY=AIza...
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
```

## 🗂️ Project Structure

```
ChatMate/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens (onboarding, login, signup)
│   ├── (main)/            # Main app screens
│   │   ├── chat/          # Chat screens
│   │   ├── history/       # History screen
│   │   └── settings/      # Settings screen
├── components/            # Reusable components
├── store/                 # Redux slices (auth, chat, settings)
├── services/              # API, Firebase, Voice services
├── hooks/                 # Custom hooks (useAuth, useVoice, useRedux)
├── types/                 # TypeScript types
└── backend/               # FastAPI backend
    ├── app/
    │   ├── routers/       # API endpoints (auth, chat, usage)
    │   ├── services/      # Business logic (AI, Firebase, prompts)
    │   ├── models/        # Pydantic schemas
    │   └── middleware/    # Rate limiting
    └── requirements.txt
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/verify` | Verify Firebase token |
| POST | `/chat/message` | Send message, get AI response |
| GET | `/chat/history` | Get user's chat history |
| GET | `/usage/status` | Get usage limits |
| GET | `/health` | Health check |

## 🎨 Features Walkthrough

The app features a modern dark UI with:

- **Onboarding** - Welcome screen with AI tone selection (Friendly/Professional/Tutor)
- **Authentication** - Email/password signup or continue as Guest
- **Chat Interface** - Send text messages, receive AI responses with typing indicators
- **Voice Input** - Hold the mic button to record voice messages
- **Voice Output** - Tap speaker icon to hear AI responses
- **History** - View all past conversations, tap to resume
- **Settings** - Change AI tone, toggle dark mode, voice settings, export chats

## � Troubleshooting

### Mobile app can't connect to backend

- Ensure your phone and computer are on the same WiFi network
- Use your computer's local IP address (not localhost) in the mobile `.env`
- Run backend with `--host 0.0.0.0` flag

### Gemini API quota exceeded

- Free tier has rate limits; wait a minute and try again
- Or create a new API key at <https://aistudio.google.com/app/apikey>

### Firebase auth errors

- Ensure Authentication is enabled in Firebase Console
- Enable Email/Password and Anonymous sign-in methods
- Check that Firestore rules allow authenticated reads/writes

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Expo, FastAPI, Firebase, and Google Gemini
