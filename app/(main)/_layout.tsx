import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: Platform.OS === "ios" ? "transparent" : "#0f172a",
                    borderTopColor: "#1e293b",
                    borderTopWidth: 1,
                    height: Platform.OS === "ios" ? 85 : 65,
                    paddingBottom: Platform.OS === "ios" ? 25 : 10,
                    paddingTop: 10,
                },
                tabBarBackground: () =>
                    Platform.OS === "ios" ? (
                        <BlurView
                            intensity={80}
                            tint="dark"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        />
                    ) : null,
                tabBarActiveTintColor: "#0ea5e9",
                tabBarInactiveTintColor: "#64748b",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="chat/index"
                options={{
                    title: "Chat",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            className={`p-1.5 rounded-xl ${focused ? "bg-primary-500/20" : ""
                                }`}
                        >
                            <Ionicons
                                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="history/index"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            className={`p-1.5 rounded-xl ${focused ? "bg-primary-500/20" : ""
                                }`}
                        >
                            <Ionicons
                                name={focused ? "time" : "time-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size, focused }) => (
                        <View
                            className={`p-1.5 rounded-xl ${focused ? "bg-primary-500/20" : ""
                                }`}
                        >
                            <Ionicons
                                name={focused ? "settings" : "settings-outline"}
                                size={size}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="chat/[id]"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
