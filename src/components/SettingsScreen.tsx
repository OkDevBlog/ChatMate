import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';

interface Props {
  onBack: () => void;
}

const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoPlayTTS, setAutoPlayTTS] = useState(true);

  const SettingItem: React.FC<{
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }> = ({ title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <SectionHeader title="Appearance" />
        <SettingItem
          title="Dark Mode"
          subtitle="Switch between light and dark themes"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
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
              onValueChange={setVoiceEnabled}
            />
          }
        />
        <SettingItem
          title="Text-to-Speech"
          subtitle="Enable AI response readout"
          rightComponent={
            <Switch
              value={ttsEnabled}
              onValueChange={setTtsEnabled}
            />
          }
        />
        <SettingItem
          title="Auto-play TTS"
          subtitle="Automatically read AI responses aloud"
          rightComponent={
            <Switch
              value={autoPlayTTS}
              onValueChange={setAutoPlayTTS}
              disabled={!ttsEnabled}
            />
          }
        />

        <SectionHeader title="About" />
        <SettingItem
          title="Version"
          subtitle="ChatMate v1.0.0"
        />
        <SettingItem
          title="Help & Support"
          onPress={() => {
            Alert.alert('Help', 'For support, please contact us at support@chatmate.app');
          }}
        />
        <SettingItem
          title="Privacy Policy"
          onPress={() => {
            Alert.alert('Privacy', 'Your privacy is important to us. We do not store your conversations.');
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#007AFF',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#666666',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
});

export default SettingsScreen;