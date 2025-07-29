export const lightTheme = {
  colors: {
    background: '#ffffff',
    surface: '#f8f9fa',
    primary: '#007AFF',
    secondary: '#5856D6',
    text: '#000000',
    textSecondary: '#555555',
    userBubble: '#DCF8C6',
    aiBubble: '#F1F0F0',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    userBubble: '#2E7D32',
    aiBubble: '#1E1E1E',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
  },
};

export type Theme = typeof lightTheme;