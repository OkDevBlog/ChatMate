import Constants from 'expo-constants';
import { ChatHistoryResponse, SendMessageRequest, SendMessageResponse, UsageStatusResponse } from '../types';
import { auth } from './firebase';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
    private async getAuthToken(): Promise<string | null> {
        const user = auth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = await this.getAuthToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Auth
    async verifyToken(): Promise<{ valid: boolean; userId: string }> {
        return this.request('/auth/verify', { method: 'POST' });
    }

    // Chat
    async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
        return this.request('/chat/message', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getChatHistory(): Promise<ChatHistoryResponse> {
        return this.request('/chat/history');
    }

    // Usage
    async getUsageStatus(): Promise<UsageStatusResponse> {
        return this.request('/usage/status');
    }

    // Health check
    async healthCheck(): Promise<{ status: string }> {
        return this.request('/health');
    }
}

export const apiService = new ApiService();
