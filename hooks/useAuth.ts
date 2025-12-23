import { onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect } from 'react';
import { auth } from '../services/firebase';
import { fetchCurrentUser, setUser, signIn, signInAsGuest, signOut, signUp } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isGuest, isLoading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                dispatch(fetchCurrentUser(firebaseUser.uid));
            } else {
                dispatch(setUser(null));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    const login = useCallback(
        (email: string, password: string) => {
            return dispatch(signIn({ email, password }));
        },
        [dispatch]
    );

    const register = useCallback(
        (email: string, password: string, tone: 'friendly' | 'professional' | 'tutor') => {
            return dispatch(signUp({ email, password, tone }));
        },
        [dispatch]
    );

    const loginAsGuest = useCallback(
        (tone: 'friendly' | 'professional' | 'tutor') => {
            return dispatch(signInAsGuest(tone));
        },
        [dispatch]
    );

    const logout = useCallback(() => {
        return dispatch(signOut());
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        isGuest,
        isLoading,
        error,
        login,
        register,
        loginAsGuest,
        logout,
    };
};
