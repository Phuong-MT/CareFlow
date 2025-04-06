// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiLogin } from '@/services/authServices';
import { User,AuthState, LoginPayload, LoginResponse } from '@/types/authTypes'; 

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
    access_token: null,
    refresh_token: null,
    isAuthenticated: false,
  };

export const login = createAsyncThunk<LoginResponse, LoginPayload,{ rejectValue: string }>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await apiLogin(payload)
    return res.data
  } catch (err: any) {
    const message = err.response?.data?.message || 'Đăng nhập thất bại'
    return rejectWithValue(message)
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Đăng nhập thất bại';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
