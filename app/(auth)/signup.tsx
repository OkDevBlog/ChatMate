import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuth } from "../../hooks";

export default function Signup() {
    const { tone } = useLocalSearchParams<{ tone?: string }>();
    const { register, isLoading, error } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        try {
            await register(email, password, (tone as 'friendly' | 'professional' | 'tutor') || 'friendly');
            router.replace("/(main)/chat");
        } catch (err: any) {
            Alert.alert("Error", err.message || "Signup failed");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <LinearGradient
                colors={["#0f172a", "#1e293b", "#0f172a"]}
                className="absolute inset-0"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 px-6 justify-center">
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-12 left-6 p-2"
                    >
                        <Ionicons name="arrow-back" size={24} color="#94a3b8" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.delay(100).springify()}
                        className="items-center mb-10"
                    >
                        <View className="w-16 h-16 rounded-2xl bg-accent-500/20 items-center justify-center mb-4">
                            <Ionicons name="person-add" size={32} color="#d946ef" />
                        </View>
                        <Text className="text-3xl font-bold text-white mb-2">
                            Create account
                        </Text>
                        <Text className="text-dark-400 text-center">
                            Start chatting with your AI companion
                        </Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View
                        entering={FadeInUp.delay(200).springify()}
                        className="gap-4"
                    >
                        {/* Email Input */}
                        <View className="bg-dark-800 rounded-2xl px-4 py-1 flex-row items-center border border-dark-700">
                            <Ionicons name="mail-outline" size={20} color="#64748b" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email address"
                                placeholderTextColor="#64748b"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 text-white text-base py-4 ml-3"
                            />
                        </View>

                        {/* Password Input */}
                        <View className="bg-dark-800 rounded-2xl px-4 py-1 flex-row items-center border border-dark-700">
                            <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                placeholderTextColor="#64748b"
                                secureTextEntry={!showPassword}
                                className="flex-1 text-white text-base py-4 ml-3"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#64748b"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password Input */}
                        <View className="bg-dark-800 rounded-2xl px-4 py-1 flex-row items-center border border-dark-700">
                            <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm password"
                                placeholderTextColor="#64748b"
                                secureTextEntry={!showPassword}
                                className="flex-1 text-white text-base py-4 ml-3"
                            />
                        </View>

                        {/* Error message */}
                        {error && (
                            <Text className="text-red-400 text-center">{error}</Text>
                        )}

                        {/* Signup Button */}
                        <TouchableOpacity
                            onPress={handleSignup}
                            disabled={isLoading}
                            className="bg-accent-500 rounded-2xl py-4 items-center mt-4"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-semibold text-lg">
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View className="flex-row justify-center items-center mt-4">
                            <Text className="text-dark-400">Already have an account? </Text>
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: "/(auth)/login", params: { tone } })}
                            >
                                <Text className="text-primary-400 font-semibold">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
