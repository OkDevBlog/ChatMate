import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../hooks";

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-dark-900">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }

    // Redirect based on auth state
    if (isAuthenticated) {
        return <Redirect href="/(main)/chat" />;
    }

    return <Redirect href="/(auth)/onboarding" />;
}
