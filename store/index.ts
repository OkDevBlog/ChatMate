import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check (Firebase timestamps)
                ignoredActions: ['auth/setUser', 'chat/setMessages', 'chat/addMessage'],
                ignoredPaths: ['auth.user.createdAt', 'chat.messages', 'chat.activeChat'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
