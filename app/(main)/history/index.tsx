import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchChats, renameChat, setActiveChat } from "@/store/chatSlice";
import { Chat } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatItem = ({
    chat,
    onPress,
    onRename,
}: {
    chat: Chat;
    onPress: () => void;
    onRename: (title: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(chat.title);

    const handleRename = () => {
        if (newTitle.trim() && newTitle !== chat.title) {
            onRename(newTitle.trim());
        }
        setIsEditing(false);
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const chatDate = new Date(date);
        const diffDays = Math.floor(
            (now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return chatDate.toLocaleDateString();
    };

    return (
        <Animated.View entering={FadeInDown.springify()}>
            <TouchableOpacity
                onPress={onPress}
                onLongPress={() => setIsEditing(true)}
                className="bg-dark-800 rounded-2xl p-4 mb-3 border border-dark-700"
            >
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center">
                        <Ionicons name="chatbubble" size={20} color="#0ea5e9" />
                    </View>
                    <View className="flex-1 ml-3">
                        {isEditing ? (
                            <TextInput
                                value={newTitle}
                                onChangeText={setNewTitle}
                                onBlur={handleRename}
                                onSubmitEditing={handleRename}
                                autoFocus
                                className="text-white font-semibold text-base bg-dark-700 rounded-lg px-2 py-1"
                            />
                        ) : (
                            <Text className="text-white font-semibold text-base" numberOfLines={1}>
                                {chat.title}
                            </Text>
                        )}
                        <Text className="text-dark-400 text-xs mt-1">
                            {formatDate(chat.updatedAt)}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#64748b" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function HistoryScreen() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { chats, isLoading } = useAppSelector((state) => state.chat);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchChats(user.uid));
        }
    }, [user?.uid, dispatch]);

    const handleChatPress = (chat: Chat) => {
        dispatch(setActiveChat(chat));
        router.push(`/(main)/chat/${chat.chatId}`);
    };

    const handleRename = (chatId: string, title: string) => {
        dispatch(renameChat({ chatId, title }));
    };

    const handleNewChat = () => {
        dispatch(setActiveChat(null));
        router.push("/(main)/chat");
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-900">
            <LinearGradient
                colors={["#0f172a", "#1e293b", "#0f172a"]}
                className="absolute inset-0"
            />

            {/* Header */}
            <View className="px-4 py-3 flex-row items-center justify-between border-b border-dark-800">
                <Text className="text-white text-2xl font-bold">History</Text>
                <TouchableOpacity
                    onPress={handleNewChat}
                    className="bg-primary-500 px-4 py-2 rounded-xl flex-row items-center"
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-1">New Chat</Text>
                </TouchableOpacity>
            </View>

            {/* Chat List */}
            <FlatList
                data={chats}
                renderItem={({ item }) => (
                    <ChatItem
                        chat={item}
                        onPress={() => handleChatPress(item)}
                        onRename={(title) => handleRename(item.chatId, title)}
                    />
                )}
                keyExtractor={(item) => item.chatId}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Animated.View
                        entering={FadeIn.delay(200)}
                        className="flex-1 items-center justify-center py-20"
                    >
                        <View className="w-24 h-24 rounded-3xl bg-dark-800 items-center justify-center mb-4">
                            <Ionicons name="folder-open-outline" size={48} color="#64748b" />
                        </View>
                        <Text className="text-white text-xl font-semibold mb-2">
                            No conversations yet
                        </Text>
                        <Text className="text-dark-400 text-center px-8 mb-6">
                            Start chatting to see your conversation history here
                        </Text>
                        <TouchableOpacity
                            onPress={handleNewChat}
                            className="bg-primary-500 px-6 py-3 rounded-xl"
                        >
                            <Text className="text-white font-semibold">Start Chatting</Text>
                        </TouchableOpacity>
                    </Animated.View>
                }
            />
        </SafeAreaView>
    );
}
