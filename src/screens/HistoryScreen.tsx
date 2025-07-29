import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loadChats, setCurrentChat } from '../store/slices/chatSlice';
import { lightTheme, darkTheme } from '../styles/theme';
import { Chat } from '../types';

interface Props {
  onChatSelect: (chat: Chat) => void;
}

const HistoryScreen: React.FC<Props> = ({ onChatSelect }) => {
  const dispatch = useDispatch();
  const { chats, isLoading } = useSelector((state: RootState) => state.chat);
  const theme = useSelector((state: RootState) => 
    state.settings.theme === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    dispatch(loadChats());
  }, [dispatch]);

  const handleChatPress = (chat: Chat) => {
    dispatch(setCurrentChat(chat));
    onChatSelect(chat);
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete chat functionality
            console.log('Delete chat:', chatId);
          },
        },
      ]
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const preview = lastMessage?.content.substring(0, 100) + '...' || 'No messages';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item)}
        onLongPress={() => handleDeleteChat(item.id)}
      >
        <View style={styles.chatHeader}>
          <Text style={[styles.chatTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.chatDate, { color: theme.colors.textSecondary }]}>
            {new Date(item.updated_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.chatPreview, { color: theme.colors.textSecondary }]}>
          {preview}
        </Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    chatItem: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    chatTitle: {
      ...theme.typography.body,
      fontWeight: '600',
      flex: 1,
    },
    chatDate: {
      ...theme.typography.caption,
    },
    chatPreview: {
      ...theme.typography.caption,
      lineHeight: 18,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (chats.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat History</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No conversations yet. Start chatting to see your history here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat History</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={() => dispatch(loadChats())}
      />
    </View>
  );
};

export default HistoryScreen;