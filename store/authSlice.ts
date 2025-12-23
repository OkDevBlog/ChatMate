import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInAnonymously,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { AuthState, User } from '../types';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isGuest: false,
    isLoading: true,
    error: null,
};

// Sign up with email
export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ email, password, tone }: { email: string; password: string; tone: 'friendly' | 'professional' | 'tutor' }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, 'users', uid), {
                uid,
                email,
                isPremium: false,
                dailyUsage: 0,
                selectedTone: tone,
                createdAt: serverTimestamp(),
            });

            return {
                uid,
                email,
                isPremium: false,
                dailyUsage: 0,
                selectedTone: tone,
                createdAt: new Date().toISOString(),
            } as User;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign up');
        }
    }
);

// Sign in with email
export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;

            // Get user document from Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return {
                    uid,
                    email: data.email,
                    isPremium: data.isPremium,
                    dailyUsage: data.dailyUsage,
                    selectedTone: data.selectedTone,
                    createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
                } as User;
            }

            throw new Error('User data not found');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign in');
        }
    }
);

// Guest sign in
export const signInAsGuest = createAsyncThunk(
    'auth/signInAsGuest',
    async (tone: 'friendly' | 'professional' | 'tutor', { rejectWithValue }) => {
        try {
            const userCredential = await signInAnonymously(auth);
            const { uid } = userCredential.user;

            // Create guest user document
            await setDoc(doc(db, 'users', uid), {
                uid,
                email: null,
                isPremium: false,
                dailyUsage: 0,
                selectedTone: tone,
                createdAt: serverTimestamp(),
                isGuest: true,
            });

            return {
                uid,
                email: null,
                isPremium: false,
                dailyUsage: 0,
                selectedTone: tone,
                createdAt: new Date().toISOString(),
            } as User;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign in as guest');
        }
    }
);

// Sign out
export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to sign out');
        }
    }
);

// Fetch current user
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (uid: string, { rejectWithValue }) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return {
                    uid,
                    email: data.email,
                    isPremium: data.isPremium,
                    dailyUsage: data.dailyUsage,
                    selectedTone: data.selectedTone,
                    createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
                } as User;
            }
            throw new Error('User not found');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isGuest = action.payload?.email === null;
            state.isLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateTone: (state, action: PayloadAction<'friendly' | 'professional' | 'tutor'>) => {
            if (state.user) {
                state.user.selectedTone = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign Up
            .addCase(signUp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isGuest = false;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Sign In
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isGuest = false;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Guest Sign In
            .addCase(signInAsGuest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signInAsGuest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isGuest = true;
            })
            .addCase(signInAsGuest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Sign Out
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isGuest = false;
            })
            // Fetch Current User
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isGuest = action.payload.email === null;
                state.isLoading = false;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setLoading, setUser, clearError, updateTone } = authSlice.actions;
export default authSlice.reducer;
