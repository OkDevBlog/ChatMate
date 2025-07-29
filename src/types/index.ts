export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium';
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  chat_id: string;
}

export interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  messages: Message[];
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentChat: Chat | null;
  chats: Chat[];
  isLoading: boolean;
  theme: 'light' | 'dark';
  voiceEnabled: boolean;
  ttsEnabled: boolean;
}

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}