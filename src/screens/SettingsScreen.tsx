import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { signOut } from '../store/slices/authSlice';
import { setTheme, toggleVoice, toggleTTS, toggleAutoPlayTTS } from '../store/slices/settingsSlice';
import { lightTheme, darkTheme } from '../styles/theme';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme, voiceEnabled, ttsEnabled, autoPlayTTS } = useSelector((state: RootState) => state.settings);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => dispatch(signOut()),
        },
      ]
    );
  };

  const SettingItem: React.FC<{
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }> = ({ title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: currentTheme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: currentTheme.colors.textSecondary }]}>
      {title}
    </Text>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      padding: currentTheme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    headerTitle: {
      ...currentTheme.typography.h2,
      color: currentTheme.colors.text,
    },
    content: {
      flex: 1,
    },
    sectionHeader: {
      ...currentTheme.typography.caption,
      fontWeight: '600',
      textTransform: 'uppercase',
      paddingHorizontal: currentTheme.spacing.lg,
      paddingTop: currentTheme.spacing.lg,
      paddingBottom: currentTheme.spacing.sm,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: currentTheme.spacing.lg,
      paddingVertical: currentTheme.spacing.md,
      backgroundColor: currentTheme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      ...currentTheme.typography.body,
      fontWeight: '500',
    },
    settingSubtitle: {
      ...currentTheme.typography.caption,
      marginTop: 2,
    },
    userInfo: {
      padding: currentTheme.spacing.lg,
      backgroundColor: currentTheme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    userEmail: {
      ...currentTheme.typography.body,
      color: currentTheme.colors.text,
      fontWeight: '500',
    },
    userTier: {
      ...currentTheme.typography.caption,
      color: currentTheme.colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        {isAuthenticated && user && (
          <>
            <SectionHeader title="Account" />
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userTier}>
                {user.subscription_tier === 'premium' ? 'Premium Member' : 'Free Tier'}
              </Text>
            </View>
          </>
        )}

        <SectionHeader title="Appearance" />
        <SettingItem
          title="Dark Mode"
          subtitle="Switch between light and dark themes"
          rightComponent={
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => dispatch(setTheme(value ? 'dark' : 'light'))}
            />
          }
        />

        <SectionHeader title="Voice & Audio" />
        <SettingItem
          title="Voice Input"
          subtitle="Enable voice-to-text functionality"
          rightComponent={
            <Switch
              value={voiceEnabled}
              onValueChange={() => dispatch(toggleVoice())}
            />
          }
        />
        <SettingItem
          title="Text-to-Speech"
          subtitle="Enable AI response readout"
          rightComponent={
            <Switch
              value={ttsEnabled}
              onValueChange={() => dispatch(toggleTTS())}
            />
          }
        />
        <SettingItem
          title="Auto-play TTS"
          subtitle="Automatically read AI responses aloud"
          rightComponent={
            <Switch
              value={autoPlayTTS}
              onValueChange={() => dispatch(toggleAutoPlayTTS())}
              disabled={!ttsEnabled}
            />
          }
        />

        {user?.subscription_tier === 'free' && (
          <>
            <SectionHeader title="Subscription" />
            <SettingItem
              title="Upgrade to Premium"
              subtitle="Unlimited messages and faster responses"
              onPress={() => {
                Alert.alert('Premium Features', 'Premium subscription coming soon!');
              }}
            />
          </>
        )}

        <SectionHeader title="Support" />
        <SettingItem
          title="Help & FAQ"
          onPress={() => {
            Alert.alert('Help', 'Help documentation coming soon!');
          }}
        />
        <SettingItem
          title="Report Issue"
          onPress={() => {
            Alert.alert('Report Issue', 'Issue reporting coming soon!');
          }}
        />

        {isAuthenticated && (
          <>
            <SectionHeader title="Account Actions" />
            <SettingItem
              title="Sign Out"
              onPress={handleSignOut}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default SettingsScreen;