import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchMessages, setActiveChat } from "@/store/chatSlice";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import ChatScreen from "./index";

export default function ChatById() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { chats, isLoading } = useAppSelector((state) => state.chat);

    useEffect(() => {
        if (id) {
            const chat = chats.find((c) => c.chatId === id);
            if (chat) {
                dispatch(setActiveChat(chat));
                dispatch(fetchMessages(id));
            } else {
                // Chat not found, redirect to main chat
                router.replace("/(main)/chat");
            }
        }
    }, [id, chats, dispatch]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-dark-900">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </View>
        );
    }

    // Reuse the main chat component - it will use activeChat from Redux
    return <ChatScreen />;
}
