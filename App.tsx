import React, { useState } from 'react';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FullFeaturedChatApp from './src/components/FullFeaturedChatApp';

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <FullFeaturedChatApp />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>🤖 ChatMate</Text>
      <Text style={styles.subtitle}>Your AI Companion</Text>
      <Text style={styles.status}>✅ Ready with all features!</Text>
      
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Complete Features:</Text>
        <Text style={styles.feature}>🤖 Real AI Chat with OpenAI/OpenRouter</Text>
        <Text style={styles.feature}>🎤 Voice Input & Speech Recognition</Text>
        <Text style={styles.feature}>🔊 Text-to-Speech Output</Text>
        <Text style={styles.feature}>📝 Chat History Management</Text>
        <Text style={styles.feature}>⚙️ Settings & Customization</Text>
        <Text style={styles.feature}>🌙 Dark/Light Mode Toggle</Text>
        <Text style={styles.feature}>📱 Responsive Mobile Design</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => setShowApp(true)}
      >
        <Text style={styles.startButtonText}>Launch ChatMate</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        Full-featured AI chatbot with voice capabilities!{'\n'}
        Fixed text color and removed problematic dependencies.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default App;