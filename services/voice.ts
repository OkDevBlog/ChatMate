import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

class VoiceService {
    private recording: Audio.Recording | null = null;
    private isRecording = false;

    // Initialize audio settings
    async initialize(): Promise<void> {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    // Request microphone permission
    async requestPermission(): Promise<boolean> {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Failed to request permission:', error);
            return false;
        }
    }

    // Start recording
    async startRecording(): Promise<boolean> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.error('Microphone permission not granted');
                return false;
            }

            await this.initialize();

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            this.recording = recording;
            this.isRecording = true;
            return true;
        } catch (error) {
            console.error('Failed to start recording:', error);
            return false;
        }
    }

    // Stop recording and get URI
    async stopRecording(): Promise<string | null> {
        if (!this.recording) {
            return null;
        }

        try {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            this.recording = null;
            this.isRecording = false;
            return uri;
        } catch (error) {
            console.error('Failed to stop recording:', error);
            this.recording = null;
            this.isRecording = false;
            return null;
        }
    }

    // Cancel recording
    async cancelRecording(): Promise<void> {
        if (this.recording) {
            try {
                await this.recording.stopAndUnloadAsync();
            } catch (error) {
                console.error('Failed to cancel recording:', error);
            }
            this.recording = null;
            this.isRecording = false;
        }
    }

    // Get recording status
    getRecordingStatus(): boolean {
        return this.isRecording;
    }

    // Text to speech - speak text
    async speak(text: string, options?: { rate?: number; pitch?: number; language?: string }): Promise<void> {
        return new Promise((resolve, reject) => {
            Speech.speak(text, {
                rate: options?.rate || 1.0,
                pitch: options?.pitch || 1.0,
                language: options?.language || 'en-US',
                onDone: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    }

    // Stop speaking
    stopSpeaking(): void {
        Speech.stop();
    }

    // Check if speaking
    async isSpeaking(): Promise<boolean> {
        return Speech.isSpeakingAsync();
    }

    // Get available voices
    async getVoices(): Promise<Speech.Voice[]> {
        return Speech.getAvailableVoicesAsync();
    }

    // Play audio file
    async playAudio(uri: string): Promise<void> {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();

            // Cleanup after playing
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }
}

export const voiceService = new VoiceService();
