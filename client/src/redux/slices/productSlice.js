// redux/slices/productSlice.js — Product State

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/products?${query}`);
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchProduct = createAsyncThunk('product/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data.product;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchCategories = createAsyncThunk('product/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/categories');
    return res.data.categories;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products:      [],
    product:       null,
    categories:    [],
    pagination:    {},
    loading:       false,
    productLoading: false,
    error:         null,
    filters: {
      search: '', category: '', brand: '',
      minPrice: '', maxPrice: '', sort: '-createdAt',
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { search: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: '-createdAt' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload.products; s.pagination = a.payload.pagination; })
      .addCase(fetchProducts.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProduct.pending,    (s) => { s.productLoading = true; s.product = null; })
      .addCase(fetchProduct.fulfilled,  (s, a) => { s.productLoading = false; s.product = a.payload; })
      .addCase(fetchProduct.rejected,   (s, a) => { s.productLoading = false; s.error = a.payload; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
