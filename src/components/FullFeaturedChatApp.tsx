import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Switch,
  FlatList,
  Dimensions,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { sendMessageToOpenAI, OpenAIMessage } from '../services/openai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

type Screen = 'chat' | 'settings' | 'history';

const { width } = Dimensions.get('window');

const FullFeaturedChatApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant with voice capabilities. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Settings
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoPlayTTS, setAutoPlayTTS] = useState(true);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock chat history
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'General Chat',
      lastMessage: 'Thanks for your help!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 12,
    },
    {
      id: '2',
      title: 'React Native Help',
      lastMessage: 'How do I implement navigation?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 8,
    },
  ]);

  useEffect(() => {
    // Initialize Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // Initialize TTS
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const onSpeechStart = () => setIsRecording(true);
  const onSpeechEnd = () => setIsRecording(false);
  const onSpeechResults = (event: any) => setInputText(event.value[0]);
  const onSpeechError = (event: any) => {
    console.error('Speech error:', event.error);
    setIsRecording(false);
    Alert.alert('Voice Error', 'Could not recognize speech. Please try again.');
  };

  const startVoiceRecognition = async () => {
    if (!voiceEnabled) return;
    try {
      await Voice.start('en-US');
    } catch (error) {
      Alert.alert('Voice Error', 'Could not start voice recognition.');
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Voice stop error:', error);
    }
  };

  const speakText = (text: string) => {
    if (ttsEnabled) {
      Tts.speak(text);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const conversationHistory: OpenAIMessage[] = [
        {
          role: 'system',
          content: 'You are ChatMate, a helpful and friendly AI assistant. Be conversational, helpful, and concise.',
        },
        ...messages.slice(-10).map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text,
        })),
        {
          role: 'user',
          content: messageText,
        },
      ];

      const aiResponse = await sendMessageToOpenAI(conversationHistory);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (autoPlayTTS) {
        speakText(aiResponse);
      }

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error: any) {
      const demoResponses = [
        "I'm having trouble connecting to the AI service, but I'm here to help!",
        "Thanks for your message! I'm currently in demo mode.",
        "Your message was received! The AI service is temporarily unavailable.",
      ];
      
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      if (autoPlayTTS) {
        speakText(randomResponse);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const theme = {
    background: darkMode ? '#121212' : '#ffffff',
    surface: darkMode ? '#1E1E1E' : '#f8f9fa',
    primary: '#007AFF',
    text: darkMode ? '#ffffff' : '#000000',
    textSecondary: darkMode ? '#aaaaaa' : '#666666',
    userBubble: darkMode ? '#2E7D32' : '#DCF8C6',
    aiBubble: darkMode ? '#1E1E1E' : '#F1F0F0',
    border: darkMode ? '#38383A' : '#e0e0e0',
  };

  const renderMessage = (message: Message) => (
    <Animated.View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
        {
          backgroundColor: message.isUser ? theme.userBubble : theme.aiBubble,
        },
      ]}
    >
      <Text style={[styles.messageText, { color: theme.text }]}>
        {message.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {!message.isUser && (
          <TouchableOpacity
            onPress={() => speakText(message.text)}
            style={styles.speakButton}
          >
            <Text style={styles.speakButtonText}>🔊</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderChatScreen = () => (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>🤖 ChatMate</Text>
        <Text style={styles.headerSubtitle}>Your AI Companion</Text>
        <View style={styles.settingsRow}>
          <TouchableOpacity
            onPress={() => setVoiceEnabled(!voiceEnabled)}
            style={[styles.toggleButton, voiceEnabled && styles.toggleButtonActive]}
          >
            <Text style={styles.toggleText}>🎤 Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTtsEnabled(!ttsEnabled)}
            style={[styles.toggleButton, ttsEnabled && styles.toggleButtonActive]}
          >
            <Text style={styles.toggleText}>🔊 TTS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={[styles.messageContainer, styles.aiMessage, { backgroundColor: theme.aiBubble }]}>
            <Text style={[styles.messageText, { color: theme.text }]}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonActive,
              !voiceEnabled && styles.voiceButtonDisabled,
            ]}
            onPressIn={startVoiceRecognition}
            onPressOut={stopVoiceRecognition}
            disabled={!voiceEnabled || isLoading}
          >
            <Text style={styles.voiceButtonText}>
              {isRecording ? '🎙️' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TextInput
          style={[styles.textInput, { color: theme.text, backgroundColor: theme.background }]}
          placeholder="Type your message or hold mic..."
          placeholderTextColor={theme.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomNav, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentScreen('history')}
        >
          <Text style={styles.navButtonText}>📝 History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentScreen('settings')}
        >
          <Text style={styles.navButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  const renderSettingsScreen = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => setCurrentScreen('chat')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>VOICE & AUDIO</Text>
        <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Voice Input</Text>
          <Switch value={voiceEnabled} onValueChange={setVoiceEnabled} />
        </View>
        <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Text-to-Speech</Text>
          <Switch value={ttsEnabled} onValueChange={setTtsEnabled} />
        </View>
        <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Auto-play TTS</Text>
          <Switch value={autoPlayTTS} onValueChange={setAutoPlayTTS} disabled={!ttsEnabled} />
        </View>

        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>ABOUT</Text>
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.surface }]}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Version</Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>ChatMate v1.0.0</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderHistoryScreen = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => setCurrentScreen('chat')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={chatHistory}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chatItem, { backgroundColor: theme.surface }]}
            onPress={() => {
              Alert.alert('Chat Selected', `Opening "${item.title}"`);
              setCurrentScreen('chat');
            }}
          >
            <View style={styles.chatIcon}>
              <Text style={styles.chatIconText}>💬</Text>
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.chatTime, { color: theme.textSecondary }]}>
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>
              <Text style={[styles.chatPreview, { color: theme.textSecondary }]} numberOfLines={2}>
                {item.lastMessage}
              </Text>
              <Text style={[styles.messageCount, { color: theme.textSecondary }]}>
                {item.messageCount} messages
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  switch (currentScreen) {
    case 'settings':
      return renderSettingsScreen();
    case 'history':
      return renderHistoryScreen();
    default:
      return renderChatScreen();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholder: {
    width: 60,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  speakButton: {
    padding: 4,
  },
  speakButtonText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceButtonActive: {
    backgroundColor: '#FF3B30',
  },
  voiceButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  voiceButtonText: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatIconText: {
    fontSize: 20,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
  },
  chatPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageCount: {
    fontSize: 12,
  },
});

export default FullFeaturedChatApp;