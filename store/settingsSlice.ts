import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings } from '../types';

const initialState: Settings = {
    selectedTone: 'friendly',
    darkMode: true,
    voiceEnabled: true,
    autoPlayResponses: false,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTone: (state, action: PayloadAction<'friendly' | 'professional' | 'tutor'>) => {
            state.selectedTone = action.payload;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        },
        toggleVoice: (state) => {
            state.voiceEnabled = !state.voiceEnabled;
        },
        setVoiceEnabled: (state, action: PayloadAction<boolean>) => {
            state.voiceEnabled = action.payload;
        },
        toggleAutoPlay: (state) => {
            state.autoPlayResponses = !state.autoPlayResponses;
        },
        setAutoPlay: (state, action: PayloadAction<boolean>) => {
            state.autoPlayResponses = action.payload;
        },
        resetSettings: () => initialState,
    },
});

export const {
    setTone,
    toggleDarkMode,
    setDarkMode,
    toggleVoice,
    setVoiceEnabled,
    toggleAutoPlay,
    setAutoPlay,
    resetSettings
} = settingsSlice.actions;
export default settingsSlice.reducer;
