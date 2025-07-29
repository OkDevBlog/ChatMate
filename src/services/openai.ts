import { ENV } from '../config/env';

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToOpenAI = async (messages: OpenAIMessage[]): Promise<string> => {
  try {
    // Determine if using OpenRouter or direct OpenAI based on API key
    const isOpenRouter = ENV.OPENAI_API_KEY.startsWith('sk-or-');
    const apiUrl = isOpenRouter 
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
    };

    // Add OpenRouter specific headers if needed
    if (isOpenRouter) {
      headers['HTTP-Referer'] = 'https://chatmate.app';
      headers['X-Title'] = 'ChatMate';
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: isOpenRouter ? 'openai/gpt-3.5-turbo' : ENV.OPENAI_MODEL,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};