import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUser } from '../store/slices/authSlice';
import { supabase } from '../config/supabase';
import { lightTheme, darkTheme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => 
    state.settings.theme === 'dark' ? darkTheme : lightTheme
  );
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          dispatch(setUser(session.user as any));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setTimeout(onFinish, 2000);
      }
    };

    checkSession();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      fontSize: 48,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    tagline: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      position: 'absolute',
      bottom: 100,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>🤖</Text>
        <Text style={styles.logo}>ChatMate</Text>
        <Text style={styles.tagline}>Your On-the-Go AI Companion</Text>
      </Animated.View>
      
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

export default SplashScreen;