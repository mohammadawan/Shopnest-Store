// redux/slices/cartSlice.js — Cart State

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/cart');
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await API.post('/cart', { productId, quantity });
    toast.success('Added to cart! 🛒');
    return res.data.cart;
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to add to cart.');
    return rejectWithValue(e.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/cart/${itemId}`, { quantity });
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const res = await API.delete(`/cart/${itemId}`);
    toast.info('Item removed from cart.');
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await API.delete('/cart/clear');
    return { items: [], total: 0 };
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0, loading: false, error: null },
  reducers: {
    resetCart(state) { state.items = []; state.total = 0; },
  },
  extraReducers: (builder) => {
    const setLoading = (s) => { s.loading = true; };
    const setCart = (s, a) => { s.loading = false; s.items = a.payload?.items || []; s.total = a.payload?.total || 0; };
    const setError = (s, a) => { s.loading = false; s.error = a.payload; };

    [fetchCart, addToCart, updateCartItem, removeCartItem, clearCart].forEach((thunk) => {
      builder.addCase(thunk.pending,   setLoading);
      builder.addCase(thunk.fulfilled, setCart);
      builder.addCase(thunk.rejected,  setError);
    });
  },
});

export const { resetCart } = cartSlice.actions;

// Selectors
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
