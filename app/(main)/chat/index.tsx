import { useAppDispatch, useAppSelector, useVoice } from "@/hooks";
import { sendMessage, setActiveChat } from "@/store/chatSlice";
import { Message } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Typing indicator component
const TypingIndicator = () => {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    useEffect(() => {
        const duration = 400;
        dot1.value = withRepeat(
            withSequence(
                withTiming(-5, { duration }),
                withTiming(0, { duration })
            ),
            -1
        );
        setTimeout(() => {
            dot2.value = withRepeat(
                withSequence(
                    withTiming(-5, { duration }),
                    withTiming(0, { duration })
                ),
                -1
            );
        }, 150);
        setTimeout(() => {
            dot3.value = withRepeat(
                withSequence(
                    withTiming(-5, { duration }),
                    withTiming(0, { duration })
                ),
                -1
            );
        }, 300);
    }, []);

    const animatedDot1 = useAnimatedStyle(() => ({
        transform: [{ translateY: dot1.value }],
    }));
    const animatedDot2 = useAnimatedStyle(() => ({
        transform: [{ translateY: dot2.value }],
    }));
    const animatedDot3 = useAnimatedStyle(() => ({
        transform: [{ translateY: dot3.value }],
    }));

    return (
        <View className="flex-row items-center px-4 py-3 bg-dark-800 rounded-2xl rounded-bl-md self-start max-w-[80%] ml-4 mb-4">
            <View className="flex-row gap-1">
                <Animated.View
                    style={animatedDot1}
                    className="w-2 h-2 rounded-full bg-primary-400"
                />
                <Animated.View
                    style={animatedDot2}
                    className="w-2 h-2 rounded-full bg-primary-400"
                />
                <Animated.View
                    style={animatedDot3}
                    className="w-2 h-2 rounded-full bg-primary-400"
                />
            </View>
        </View>
    );
};

// Message bubble component
const MessageBubble = ({
    message,
    onSpeak,
    isSpeaking,
}: {
    message: Message;
    onSpeak: (text: string) => void;
    isSpeaking: boolean;
}) => {
    const isUser = message.sender === "user";

    return (
        <Animated.View
            entering={FadeInDown.springify()}
            className={`mb-3 ${isUser ? "items-end" : "items-start"}`}
        >
            <View
                className={`max-w-[85%] px-4 py-3 ${isUser
                    ? "bg-primary-500 rounded-2xl rounded-br-md"
                    : "bg-dark-800 rounded-2xl rounded-bl-md"
                    }`}
            >
                <Text className={`text-base ${isUser ? "text-white" : "text-dark-100"}`}>
                    {message.content}
                </Text>

                {/* Voice indicator & play button for AI messages */}
                {!isUser && (
                    <TouchableOpacity
                        onPress={() => onSpeak(message.content)}
                        className="flex-row items-center mt-2"
                    >
                        <Ionicons
                            name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                            size={16}
                            color="#64748b"
                        />
                        <Text className="text-dark-500 text-xs ml-1">
                            {isSpeaking ? "Speaking..." : "Listen"}
                        </Text>
                    </TouchableOpacity>
                )}

                {message.isVoice && isUser && (
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="mic" size={12} color="#fff" />
                        <Text className="text-white/70 text-xs ml-1">Voice</Text>
                    </View>
                )}
            </View>
            <Text className="text-dark-600 text-xs mt-1 mx-2">
                {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </Text>
        </Animated.View>
    );
};

// Voice recording button
const VoiceButton = ({
    isRecording,
    onStartRecording,
    onStopRecording,
}: {
    isRecording: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
}) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isRecording) {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 500 }),
                    withTiming(1, { duration: 500 })
                ),
                -1
            );
        } else {
            scale.value = withTiming(1, { duration: 200 });
        }
    }, [isRecording]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            onPressIn={onStartRecording}
            onPressOut={onStopRecording}
            className="relative"
        >
            <Animated.View
                style={animatedStyle}
                className={`w-12 h-12 rounded-full items-center justify-center ${isRecording ? "bg-red-500" : "bg-primary-500"
                    }`}
            >
                <Ionicons name="mic" size={24} color="#fff" />
            </Animated.View>
            {isRecording && (
                <View className="absolute -inset-2 rounded-full border-2 border-red-500 opacity-50" />
            )}
        </TouchableOpacity>
    );
};

export default function ChatScreen() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { activeChat, messages, isSending } = useAppSelector((state) => state.chat);
    const { selectedTone } = useAppSelector((state) => state.settings);

    const { isRecording, isPlaying, startRecording, stopRecording, speak, stopSpeaking } = useVoice();

    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!inputText.trim() || !user) return;

        const text = inputText.trim();
        setInputText("");

        dispatch(
            sendMessage({
                content: text,
                chatId: activeChat?.chatId,
                userId: user.uid,
                tone: user.selectedTone || selectedTone,
            })
        );
    };

    const handleVoiceStart = async () => {
        await startRecording();
    };

    const handleVoiceStop = async () => {
        const uri = await stopRecording();
        if (uri) {
            // For now, we'll add a placeholder - actual STT would need a service
            // In production, send audioUri to a STT service
            setInputText("[Voice message recorded - STT coming soon]");
        }
    };

    const handleSpeak = (text: string) => {
        if (isPlaying) {
            stopSpeaking();
        } else {
            speak(text);
        }
    };

    const handleNewChat = () => {
        dispatch(setActiveChat(null));
    };

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    const renderMessage = ({ item }: { item: Message }) => (
        <MessageBubble
            message={item}
            onSpeak={handleSpeak}
            isSpeaking={isPlaying}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <LinearGradient
                colors={["#0f172a", "#1e293b", "#0f172a"]}
                className="absolute inset-0"
            />

            {/* Header */}
            <View className="px-4 py-3 flex-row items-center justify-between border-b border-dark-800">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center">
                        <Ionicons name="chatbubbles" size={20} color="#0ea5e9" />
                    </View>
                    <View className="ml-3">
                        <Text className="text-white font-semibold text-lg">
                            {activeChat?.title || "ChatMate"}
                        </Text>
                        <Text className="text-dark-400 text-xs capitalize">
                            {user?.selectedTone || selectedTone} mode
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleNewChat}
                    className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center"
                >
                    <Ionicons name="add" size={24} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.messageId}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Animated.View
                            entering={FadeIn.delay(200)}
                            className="flex-1 items-center justify-center py-20"
                        >
                            <View className="w-24 h-24 rounded-3xl bg-primary-500/10 items-center justify-center mb-4">
                                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#0ea5e9" />
                            </View>
                            <Text className="text-white text-xl font-semibold mb-2">
                                Start a conversation
                            </Text>
                            <Text className="text-dark-400 text-center px-8">
                                Type a message or tap the mic button to start talking with your AI companion
                            </Text>
                        </Animated.View>
                    }
                    ListFooterComponent={isSending ? <TypingIndicator /> : null}
                />

                {/* Input Area */}
                <View className="px-4 pb-24 pt-2 border-t border-dark-800 bg-dark-900">
                    <View className="flex-row items-end gap-2">
                        <View className="flex-1 bg-dark-800 rounded-2xl px-4 py-2 flex-row items-end border border-dark-700">
                            <TextInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Type a message..."
                                placeholderTextColor="#64748b"
                                multiline
                                maxLength={2000}
                                className="flex-1 text-white text-base max-h-24 py-2"
                                style={{ textAlignVertical: "center" }}
                            />
                        </View>

                        {inputText.trim() ? (
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={isSending}
                                className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center"
                            >
                                {isSending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons name="send" size={20} color="#fff" />
                                )}
                            </TouchableOpacity>
                        ) : (
                            <VoiceButton
                                isRecording={isRecording}
                                onStartRecording={handleVoiceStart}
                                onStopRecording={handleVoiceStop}
                            />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
