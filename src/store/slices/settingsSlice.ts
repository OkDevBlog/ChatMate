import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  voiceEnabled: boolean;
  ttsEnabled: boolean;
  autoPlayTTS: boolean;
}

const initialState: SettingsState = {
  theme: 'light',
  voiceEnabled: true,
  ttsEnabled: true,
  autoPlayTTS: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleVoice: (state) => {
      state.voiceEnabled = !state.voiceEnabled;
    },
    toggleTTS: (state) => {
      state.ttsEnabled = !state.ttsEnabled;
    },
    toggleAutoPlayTTS: (state) => {
      state.autoPlayTTS = !state.autoPlayTTS;
    },
  },
});

export const { setTheme, toggleVoice, toggleTTS, toggleAutoPlayTTS } = settingsSlice.actions;
export default settingsSlice.reducer;