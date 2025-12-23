import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { apiService } from '../services/api';
import { db } from '../services/firebase';
import { Chat, ChatState, Message } from '../types';

const initialState: ChatState = {
    activeChat: null,
    messages: [],
    chats: [],
    isLoading: false,
    isSending: false,
    error: null,
};

// Fetch chat history
export const fetchChats = createAsyncThunk(
    'chat/fetchChats',
    async (userId: string, { rejectWithValue }) => {
        try {
            const chatsRef = collection(db, 'chats');
            const q = query(
                chatsRef,
                where('userId', '==', userId),
                orderBy('updatedAt', 'desc')
            );
            const snapshot = await getDocs(q);

            const chats: Chat[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    chatId: doc.id,
                    userId: data.userId,
                    title: data.title,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                };
            });

            return chats;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch chats');
        }
    }
);

// Fetch messages for a chat
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (chatId: string, { rejectWithValue }) => {
        try {
            const messagesRef = collection(db, 'messages');
            const q = query(
                messagesRef,
                where('chatId', '==', chatId),
                orderBy('timestamp', 'asc')
            );
            const snapshot = await getDocs(q);

            const messages: Message[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    messageId: doc.id,
                    chatId: data.chatId,
                    sender: data.sender,
                    content: data.content,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    isVoice: data.isVoice || false,
                };
            });

            return messages;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch messages');
        }
    }
);

// Send message and get AI response
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ content, chatId, userId, tone, isVoice = false }: {
        content: string;
        chatId?: string;
        userId: string;
        tone: 'friendly' | 'professional' | 'tutor';
        isVoice?: boolean;
    }, { rejectWithValue }) => {
        try {
            let currentChatId = chatId;

            // Create new chat if needed
            if (!currentChatId) {
                const chatRef = await addDoc(collection(db, 'chats'), {
                    userId,
                    title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                currentChatId = chatRef.id;
            }

            // Add user message to Firestore
            const userMessageRef = await addDoc(collection(db, 'messages'), {
                chatId: currentChatId,
                sender: 'user',
                content,
                timestamp: serverTimestamp(),
                isVoice,
            });

            const userMessage: Message = {
                messageId: userMessageRef.id,
                chatId: currentChatId,
                sender: 'user',
                content,
                timestamp: new Date(),
                isVoice,
            };

            // Call backend API for AI response
            const response = await apiService.sendMessage({
                chatId: currentChatId,
                content,
                tone,
            });

            // Add AI response to Firestore
            const aiMessageRef = await addDoc(collection(db, 'messages'), {
                chatId: currentChatId,
                sender: 'ai',
                content: response.content,
                timestamp: serverTimestamp(),
            });

            const aiMessage: Message = {
                messageId: aiMessageRef.id,
                chatId: currentChatId,
                sender: 'ai',
                content: response.content,
                timestamp: new Date(),
            };

            // Update chat timestamp
            await updateDoc(doc(db, 'chats', currentChatId), {
                updatedAt: serverTimestamp(),
            });

            return {
                chatId: currentChatId,
                userMessage,
                aiMessage,
                isNewChat: !chatId,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to send message');
        }
    }
);

// Create new chat
export const createChat = createAsyncThunk(
    'chat/createChat',
    async (userId: string, { rejectWithValue }) => {
        try {
            const chatRef = await addDoc(collection(db, 'chats'), {
                userId,
                title: 'New Chat',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return {
                chatId: chatRef.id,
                userId,
                title: 'New Chat',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Chat;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create chat');
        }
    }
);

// Rename chat
export const renameChat = createAsyncThunk(
    'chat/renameChat',
    async ({ chatId, title }: { chatId: string; title: string }, { rejectWithValue }) => {
        try {
            await updateDoc(doc(db, 'chats', chatId), { title });
            return { chatId, title };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to rename chat');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<Chat | null>) => {
            state.activeChat = action.payload;
            state.messages = [];
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        addOptimisticMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Chats
            .addCase(fetchChats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Messages
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Send Message
            .addCase(sendMessage.pending, (state) => {
                state.isSending = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSending = false;
                state.messages.push(action.payload.userMessage);
                state.messages.push(action.payload.aiMessage);

                // Update active chat
                if (action.payload.isNewChat || !state.activeChat) {
                    state.activeChat = {
                        chatId: action.payload.chatId,
                        userId: action.payload.userMessage.chatId,
                        title: action.payload.userMessage.content.slice(0, 50),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                }

                // Add to chats list if new
                if (action.payload.isNewChat) {
                    state.chats.unshift(state.activeChat!);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isSending = false;
                state.error = action.payload as string;
            })
            // Create Chat
            .addCase(createChat.fulfilled, (state, action) => {
                state.activeChat = action.payload;
                state.messages = [];
                state.chats.unshift(action.payload);
            })
            // Rename Chat
            .addCase(renameChat.fulfilled, (state, action) => {
                const { chatId, title } = action.payload;
                const chat = state.chats.find(c => c.chatId === chatId);
                if (chat) {
                    chat.title = title;
                }
                if (state.activeChat?.chatId === chatId) {
                    state.activeChat.title = title;
                }
            });
    },
});

export const { setActiveChat, clearMessages, clearError, addOptimisticMessage } = chatSlice.actions;
export default chatSlice.reducer;
