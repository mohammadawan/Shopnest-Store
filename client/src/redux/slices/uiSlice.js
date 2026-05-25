// redux/slices/uiSlice.js — Global UI State

import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('shopnest_dark');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode:       saved === 'true',
    mobileMenuOpen: false,
    searchOpen:     false,
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('shopnest_dark', state.darkMode);
      document.documentElement.classList.toggle('dark', state.darkMode);
    },
    setMobileMenu(state, action) {
      state.mobileMenuOpen = action.payload;
    },
    setSearchOpen(state, action) {
      state.searchOpen = action.payload;
    },
  },
});

export const { toggleDarkMode, setMobileMenu, setSearchOpen } = uiSlice.actions;
export default uiSlice.reducer;
