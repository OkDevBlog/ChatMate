// Environment configuration
export const ENV = {
  // Supabase Configuration
  SUPABASE_URL: 'https://aidxxdbbouyuxhubvwkn.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZHh4ZGJib3V5dXhodWJ2d2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzkyNTEsImV4cCI6MjA2OTM1NTI1MX0.YDy2n4uJnQFkCKWZ0WxaQf-zItWmMlsxQqnobRy1xHI',
  
  // OpenAI Configuration
  OPENAI_API_KEY: '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',
  OPENAI_MODEL: 'gpt-3.5-turbo',
  
  // App Configuration
  APP_NAME: 'ChatMate',
  VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_VOICE: true,
  ENABLE_TTS: true,
  ENABLE_PREMIUM: false, // Set to true when Stripe is configured
  
  // Limits
  FREE_DAILY_MESSAGES: 50,
  MAX_MESSAGE_LENGTH: 1000,
};