import { useCallback, useRef, useState } from 'react';
import { voiceService } from '../services/voice';

export const useVoice = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recordingUri = useRef<string | null>(null);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            const started = await voiceService.startRecording();
            if (started) {
                setIsRecording(true);
            } else {
                setError('Failed to start recording. Please check microphone permissions.');
            }
            return started;
        } catch (err: any) {
            setError(err.message || 'Recording failed');
            return false;
        }
    }, []);

    const stopRecording = useCallback(async () => {
        try {
            const uri = await voiceService.stopRecording();
            setIsRecording(false);
            recordingUri.current = uri;
            return uri;
        } catch (err: any) {
            setError(err.message || 'Failed to stop recording');
            setIsRecording(false);
            return null;
        }
    }, []);

    const cancelRecording = useCallback(async () => {
        await voiceService.cancelRecording();
        setIsRecording(false);
        recordingUri.current = null;
    }, []);

    const speak = useCallback(async (text: string) => {
        try {
            setError(null);
            setIsPlaying(true);
            await voiceService.speak(text);
            setIsPlaying(false);
        } catch (err: any) {
            setError(err.message || 'Speech failed');
            setIsPlaying(false);
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        voiceService.stopSpeaking();
        setIsPlaying(false);
    }, []);

    const playAudio = useCallback(async (uri: string) => {
        try {
            setError(null);
            setIsPlaying(true);
            await voiceService.playAudio(uri);
            setIsPlaying(false);
        } catch (err: any) {
            setError(err.message || 'Audio playback failed');
            setIsPlaying(false);
        }
    }, []);

    return {
        isRecording,
        isPlaying,
        error,
        recordingUri: recordingUri.current,
        startRecording,
        stopRecording,
        cancelRecording,
        speak,
        stopSpeaking,
        playAudio,
    };
};
