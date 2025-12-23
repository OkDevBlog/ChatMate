import { useAppDispatch, useAppSelector, useAuth } from "@/hooks";
import { setTone, toggleAutoPlay, toggleDarkMode, toggleVoice } from "@/store/settingsSlice";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
    Alert,
    ScrollView,
    Share,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Tone = "friendly" | "professional" | "tutor";

const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    danger,
}: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
}) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={!onPress && !rightElement}
        className="flex-row items-center py-4 px-2"
    >
        <View
            className={`w-10 h-10 rounded-xl items-center justify-center ${danger ? "bg-red-500/20" : "bg-primary-500/20"
                }`}
        >
            <Ionicons
                name={icon as any}
                size={20}
                color={danger ? "#ef4444" : "#0ea5e9"}
            />
        </View>
        <View className="flex-1 ml-3">
            <Text className={`text-base font-medium ${danger ? "text-red-400" : "text-white"}`}>
                {title}
            </Text>
            {subtitle && <Text className="text-dark-400 text-sm">{subtitle}</Text>}
        </View>
        {rightElement || (onPress && <Ionicons name="chevron-forward" size={20} color="#64748b" />)}
    </TouchableOpacity>
);

const ToneSelector = ({
    selectedTone,
    onSelect,
}: {
    selectedTone: Tone;
    onSelect: (tone: Tone) => void;
}) => {
    const tones: { id: Tone; label: string; icon: string }[] = [
        { id: "friendly", label: "Friendly", icon: "happy-outline" },
        { id: "professional", label: "Professional", icon: "briefcase-outline" },
        { id: "tutor", label: "Tutor", icon: "school-outline" },
    ];

    return (
        <View className="flex-row gap-2 mt-2">
            {tones.map((tone) => (
                <TouchableOpacity
                    key={tone.id}
                    onPress={() => onSelect(tone.id)}
                    className={`flex-1 py-3 rounded-xl items-center ${selectedTone === tone.id
                        ? "bg-primary-500"
                        : "bg-dark-700 border border-dark-600"
                        }`}
                >
                    <Ionicons
                        name={tone.icon as any}
                        size={20}
                        color={selectedTone === tone.id ? "#fff" : "#94a3b8"}
                    />
                    <Text
                        className={`text-xs mt-1 ${selectedTone === tone.id ? "text-white" : "text-dark-400"
                            }`}
                    >
                        {tone.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default function SettingsScreen() {
    const dispatch = useAppDispatch();
    const { user, isGuest, logout } = useAuth();
    const settings = useAppSelector((state) => state.settings);
    const { messages } = useAppSelector((state) => state.chat);

    const handleExportChat = async () => {
        if (messages.length === 0) {
            Alert.alert("No messages", "Start a conversation first to export.");
            return;
        }

        const chatText = messages
            .map(
                (m) =>
                    `[${new Date(m.timestamp).toLocaleString()}] ${m.sender === "user" ? "You" : "ChatMate"
                    }: ${m.content}`
            )
            .join("\n\n");

        try {
            await Share.share({
                message: chatText,
                title: "ChatMate Conversation",
            });
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/(auth)/onboarding");
                    },
                },
            ]
        );
    };

    const handleUpgrade = () => {
        Alert.alert(
            "Premium Coming Soon",
            "Premium features with Stripe integration will be available soon!"
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <LinearGradient
                colors={["#0f172a", "#1e293b", "#0f172a"]}
                className="absolute inset-0"
            />

            {/* Header */}
            <View className="px-4 py-3 border-b border-dark-800">
                <Text className="text-white text-2xl font-bold">Settings</Text>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* User Info */}
                <Animated.View
                    entering={FadeInDown.delay(100)}
                    className="bg-dark-800 rounded-2xl p-4 mt-4 border border-dark-700"
                >
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 rounded-full bg-primary-500/20 items-center justify-center">
                            <Ionicons name="person" size={28} color="#0ea5e9" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-white font-semibold text-lg">
                                {isGuest ? "Guest User" : user?.email || "User"}
                            </Text>
                            <Text className="text-dark-400 text-sm">
                                {user?.isPremium ? "Premium Member" : "Free Plan"}
                            </Text>
                        </View>
                        {!user?.isPremium && (
                            <TouchableOpacity
                                onPress={handleUpgrade}
                                className="bg-accent-500 px-4 py-2 rounded-xl"
                            >
                                <Text className="text-white font-semibold text-sm">Upgrade</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>

                {/* AI Preferences */}
                <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
                    <Text className="text-dark-400 text-sm font-semibold uppercase tracking-wider mb-2 px-2">
                        AI Preferences
                    </Text>
                    <View className="bg-dark-800 rounded-2xl px-4 border border-dark-700">
                        <View className="py-4">
                            <Text className="text-white font-medium">Conversation Style</Text>
                            <ToneSelector
                                selectedTone={settings.selectedTone}
                                onSelect={(tone) => dispatch(setTone(tone))}
                            />
                        </View>
                    </View>
                </Animated.View>

                {/* Voice Settings */}
                <Animated.View entering={FadeInDown.delay(300)} className="mt-6">
                    <Text className="text-dark-400 text-sm font-semibold uppercase tracking-wider mb-2 px-2">
                        Voice
                    </Text>
                    <View className="bg-dark-800 rounded-2xl px-4 border border-dark-700">
                        <SettingItem
                            icon="mic-outline"
                            title="Voice Input"
                            subtitle="Enable microphone for voice messages"
                            rightElement={
                                <Switch
                                    value={settings.voiceEnabled}
                                    onValueChange={() => dispatch(toggleVoice())}
                                    trackColor={{ false: "#334155", true: "#0ea5e9" }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                        <View className="h-px bg-dark-700" />
                        <SettingItem
                            icon="volume-high-outline"
                            title="Auto-play Responses"
                            subtitle="Automatically read AI responses aloud"
                            rightElement={
                                <Switch
                                    value={settings.autoPlayResponses}
                                    onValueChange={() => dispatch(toggleAutoPlay())}
                                    trackColor={{ false: "#334155", true: "#0ea5e9" }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                    </View>
                </Animated.View>

                {/* Appearance */}
                <Animated.View entering={FadeInDown.delay(400)} className="mt-6">
                    <Text className="text-dark-400 text-sm font-semibold uppercase tracking-wider mb-2 px-2">
                        Appearance
                    </Text>
                    <View className="bg-dark-800 rounded-2xl px-4 border border-dark-700">
                        <SettingItem
                            icon="moon-outline"
                            title="Dark Mode"
                            subtitle="Use dark theme"
                            rightElement={
                                <Switch
                                    value={settings.darkMode}
                                    onValueChange={() => dispatch(toggleDarkMode())}
                                    trackColor={{ false: "#334155", true: "#0ea5e9" }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                    </View>
                </Animated.View>

                {/* Data & Export */}
                <Animated.View entering={FadeInDown.delay(500)} className="mt-6">
                    <Text className="text-dark-400 text-sm font-semibold uppercase tracking-wider mb-2 px-2">
                        Data
                    </Text>
                    <View className="bg-dark-800 rounded-2xl px-4 border border-dark-700">
                        <SettingItem
                            icon="download-outline"
                            title="Export Current Chat"
                            subtitle="Save as text file"
                            onPress={handleExportChat}
                        />
                    </View>
                </Animated.View>

                {/* Account */}
                <Animated.View entering={FadeInDown.delay(600)} className="mt-6 mb-32">
                    <Text className="text-dark-400 text-sm font-semibold uppercase tracking-wider mb-2 px-2">
                        Account
                    </Text>
                    <View className="bg-dark-800 rounded-2xl px-4 border border-dark-700">
                        {isGuest && (
                            <>
                                <SettingItem
                                    icon="person-add-outline"
                                    title="Create Account"
                                    subtitle="Save your conversations"
                                    onPress={() => router.push("/(auth)/signup")}
                                />
                                <View className="h-px bg-dark-700" />
                            </>
                        )}
                        <SettingItem
                            icon="log-out-outline"
                            title="Sign Out"
                            onPress={handleLogout}
                            danger
                        />
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
