import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import { useAppDispatch } from "../../hooks";
import { setTone } from "../../store/settingsSlice";

const { width } = Dimensions.get("window");

type Tone = "friendly" | "professional" | "tutor";

interface ToneOption {
    id: Tone;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    gradient: readonly [string, string];
}

const toneOptions: ToneOption[] = [
    {
        id: "friendly",
        title: "Friendly",
        description: "Casual, warm, and approachable",
        icon: "happy-outline",
        gradient: ["#f97316", "#fb923c"] as const,
    },
    {
        id: "professional",
        title: "Professional",
        description: "Clear, concise, and business-like",
        icon: "briefcase-outline",
        gradient: ["#0ea5e9", "#38bdf8"] as const,
    },
    {
        id: "tutor",
        title: "Tutor",
        description: "Educational, patient, and detailed",
        icon: "school-outline",
        gradient: ["#8b5cf6", "#a78bfa"] as const,
    },
];

export default function Onboarding() {
    const dispatch = useAppDispatch();
    const [selectedTone, setSelectedTone] = useState<Tone>("friendly");

    const handleContinue = (mode: "guest" | "login" | "signup") => {
        dispatch(setTone(selectedTone));
        if (mode === "guest") {
            // Guest mode will be handled in login
            router.push({ pathname: "/(auth)/login", params: { guest: "true", tone: selectedTone } });
        } else if (mode === "login") {
            router.push({ pathname: "/(auth)/login", params: { tone: selectedTone } });
        } else {
            router.push({ pathname: "/(auth)/signup", params: { tone: selectedTone } });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            {/* Background gradient */}
            <LinearGradient
                colors={["#0f172a", "#1e293b", "#0f172a"]}
                className="absolute inset-0"
            />

            <View className="flex-1 px-6 pt-12 pb-8">
                {/* Logo and Title */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="items-center mb-8"
                >
                    <View className="w-20 h-20 rounded-3xl bg-primary-500/20 items-center justify-center mb-4">
                        <Ionicons name="chatbubbles" size={40} color="#0ea5e9" />
                    </View>
                    <Text className="text-4xl font-bold text-white mb-2">ChatMate</Text>
                    <Text className="text-dark-400 text-center text-lg">
                        Think out loud. Get answers. Talk it through.
                    </Text>
                </Animated.View>

                {/* Tone Selection */}
                <Animated.View
                    entering={FadeInUp.delay(300).springify()}
                    className="flex-1"
                >
                    <Text className="text-white text-xl font-semibold mb-4 text-center">
                        Choose your AI companion's style
                    </Text>

                    <View className="gap-4">
                        {toneOptions.map((option, index) => (
                            <Animated.View
                                key={option.id}
                                entering={FadeIn.delay(400 + index * 100)}
                            >
                                <TouchableOpacity
                                    onPress={() => setSelectedTone(option.id)}
                                    className={`rounded-2xl overflow-hidden ${selectedTone === option.id
                                            ? "border-2 border-primary-500"
                                            : "border-2 border-transparent"
                                        }`}
                                >
                                    <LinearGradient
                                        colors={
                                            selectedTone === option.id
                                                ? option.gradient
                                                : ["#1e293b", "#334155"]
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        className="p-5 flex-row items-center"
                                    >
                                        <View
                                            className={`w-14 h-14 rounded-xl items-center justify-center ${selectedTone === option.id
                                                    ? "bg-white/20"
                                                    : "bg-dark-700"
                                                }`}
                                        >
                                            <Ionicons
                                                name={option.icon}
                                                size={28}
                                                color={selectedTone === option.id ? "#fff" : "#94a3b8"}
                                            />
                                        </View>
                                        <View className="ml-4 flex-1">
                                            <Text
                                                className={`text-lg font-semibold ${selectedTone === option.id
                                                        ? "text-white"
                                                        : "text-dark-200"
                                                    }`}
                                            >
                                                {option.title}
                                            </Text>
                                            <Text
                                                className={`text-sm ${selectedTone === option.id
                                                        ? "text-white/80"
                                                        : "text-dark-400"
                                                    }`}
                                            >
                                                {option.description}
                                            </Text>
                                        </View>
                                        {selectedTone === option.id && (
                                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View
                    entering={FadeInUp.delay(700).springify()}
                    className="gap-3"
                >
                    <TouchableOpacity
                        onPress={() => handleContinue("signup")}
                        className="bg-primary-500 rounded-2xl py-4 items-center"
                    >
                        <Text className="text-white font-semibold text-lg">
                            Get Started
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleContinue("login")}
                        className="bg-dark-700 rounded-2xl py-4 items-center"
                    >
                        <Text className="text-white font-semibold text-lg">
                            I have an account
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleContinue("guest")}
                        className="py-3 items-center"
                    >
                        <Text className="text-dark-400 text-base">
                            Continue as guest
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
