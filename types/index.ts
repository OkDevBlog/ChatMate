// User type from Firestore
export interface User {
    uid: string;
    email: string | null;
    isPremium: boolean;
    dailyUsage: number;
    selectedTone: 'friendly' | 'professional' | 'tutor';
    createdAt: string; // ISO string for Redux serialization
}

// Chat conversation
export interface Chat {
    chatId: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

// Message in a chat
export interface Message {
    messageId: string;
    chatId: string;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
    isVoice?: boolean;
}

// API request/response types
export interface SendMessageRequest {
    chatId?: string;
    content: string;
    tone?: 'friendly' | 'professional' | 'tutor';
}

export interface SendMessageResponse {
    messageId: string;
    chatId: string;
    content: string;
    timestamp: string;
}

export interface ChatHistoryResponse {
    chats: Chat[];
    total: number;
}

export interface UsageStatusResponse {
    dailyUsage: number;
    dailyLimit: number;
    isPremium: boolean;
    remainingMessages: number;
}

// Auth state
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    isLoading: boolean;
    error: string | null;
}

// Chat state
export interface ChatState {
    activeChat: Chat | null;
    messages: Message[];
    chats: Chat[];
    isLoading: boolean;
    isSending: boolean;
    error: string | null;
}

// Settings
export interface Settings {
    selectedTone: 'friendly' | 'professional' | 'tutor';
    darkMode: boolean;
    voiceEnabled: boolean;
    autoPlayResponses: boolean;
}

// Voice state
export interface VoiceState {
    isRecording: boolean;
    isPlaying: boolean;
    transcript: string;
}
