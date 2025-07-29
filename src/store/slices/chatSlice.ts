import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import { sendMessageToOpenAI } from '../../config/openai';
import { Chat, Message } from '../../types';

interface ChatState {
  currentChat: Chat | null;
  chats: Chat[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
}

const initialState: ChatState = {
  currentChat: null,
  chats: [],
  isLoading: false,
  isTyping: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ content, chatId }: { content: string; chatId?: string }) => {
    // Create new chat if none exists
    let currentChatId = chatId;
    if (!currentChatId) {
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          title: content.substring(0, 50) + '...',
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      currentChatId = newChat.id;
    }

    // Save user message
    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert({
        content,
        role: 'user',
        chat_id: currentChatId,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Get chat history for context
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', currentChatId)
      .order('timestamp', { ascending: true });

    // Prepare messages for OpenAI
    const openAIMessages = messages?.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })) || [];

    // Get AI response
    const aiResponse = await sendMessageToOpenAI(openAIMessages);

    // Save AI message
    const { data: aiMessage, error: aiError } = await supabase
      .from('messages')
      .insert({
        content: aiResponse,
        role: 'assistant',
        chat_id: currentChatId,
      })
      .select()
      .single();

    if (aiError) throw aiError;

    return {
      chatId: currentChatId,
      userMessage,
      aiMessage,
    };
  }
);

export const loadChats = createAsyncThunk('chat/loadChats', async () => {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages (*)
    `)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        // Update current chat with new messages
        if (state.currentChat?.id === action.payload.chatId) {
          state.currentChat.messages.push(
            action.payload.userMessage,
            action.payload.aiMessage
          );
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.error.message || 'Failed to send message';
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setCurrentChat, setTyping, clearError } = chatSlice.actions;
export default chatSlice.reducer;