// redux/slices/authSlice.js — Authentication State

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/api';

// ── Thunks ──────────────────────────────────

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('shopnest_token', res.data.token);
    localStorage.setItem('shopnest_user',  JSON.stringify(res.data.user));
    toast.success('Account created successfully! 🎉');
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed.');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', data);
    localStorage.setItem('shopnest_token', res.data.token);
    localStorage.setItem('shopnest_user',  JSON.stringify(res.data.user));
    toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}! 👋`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed.');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// ── Initial State ────────────────────────────
const savedUser = localStorage.getItem('shopnest_user');

const initialState = {
  user:      savedUser ? JSON.parse(savedUser) : null,
  token:     localStorage.getItem('shopnest_token') || null,
  loading:   false,
  error:     null,
  isLoggedIn: !!localStorage.getItem('shopnest_token'),
};

// ── Slice ─────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user      = null;
      state.token     = null;
      state.isLoggedIn = false;
      localStorage.removeItem('shopnest_token');
      localStorage.removeItem('shopnest_user');
      toast.info('Logged out successfully.');
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('shopnest_user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; });
    builder.addCase(registerUser.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isLoggedIn = true; });
    builder.addCase(registerUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; });
    // Login
    builder.addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null; });
    builder.addCase(loginUser.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isLoggedIn = true; });
    builder.addCase(loginUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; });
    // Fetch me
    builder.addCase(fetchMe.fulfilled,  (s, a) => { s.user = a.payload; });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
