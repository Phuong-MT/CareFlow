// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, isRejectedWithValue } from '@reduxjs/toolkit';
import { apiLogin, apiLoginAdmin, apiLogout, apiRegister, apiVerifyToken } from '@/services/authServices';
import { User,AuthState, LoginPayload, LoginResponse, RegisterPayload } from '@/types/authTypes'; 

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

export const loginAdmin = createAsyncThunk<LoginResponse, LoginPayload, {rejectValue: string}>('auth/login/admin', async(payload, { rejectWithValue })=>{
  try{
    const res = await apiLoginAdmin(payload);
    return res.data
  }catch(err: any){
    const message = err.response?.data?.message || 'Đăng nhập thất bại'
    return rejectWithValue(message)
  }
})

export const register = createAsyncThunk<LoginResponse, RegisterPayload, {rejectValue: string}>('user/register', async (payload,{ rejectWithValue}) => {
  try{
    const response = await apiRegister(payload)
    return response.data
  }catch(err:any){
    const message = err.response?.data?.message || 'Đăng ký thất bại'
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout',async(_, { rejectWithValue })=>{
  try{
    await apiLogout();
  }catch(error: any){
    console.error('logout error:', error);
    return rejectWithValue(error.response?.data?.message);
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: User; access_token: string; refresh_token?: string;}>) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token ?? state.refresh_token;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
    //user login
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
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.error = action.payload ?? 'Đăng nhập thất bại';
      })
    
    //user register
      .addCase(register.pending, state=>{
        state.status = 'loading',
        state.error = null
      })
      .addCase(register.fulfilled, (state,action)=>{
        state.status = 'succeeded',
        state.user = action.payload.user,
        state.access_token = action.payload.access_token,
        state.refresh_token = action.payload.refresh_token,
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed',
        state.error = action.payload ?? "Đăng kí thất bại."
      })
    //admin Login 
      .addCase(loginAdmin.pending, state=>{
        state.status = 'loading',
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action)=>{
        state.status = 'succeeded',
        state.user = action.payload.user,
        state.access_token = action.payload.access_token,
        state.refresh_token = action.payload.refresh_token,
        state.isAuthenticated = true
      })
      .addCase(loginAdmin.rejected, (state, action)=>{
        state.status = 'failed',
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.error = action.payload || 'đăng nhập thất bại.'
      })
    // logout
      .addCase(logout.pending, state=>{
        state.status = 'loading',
        state.error = null
      })
      .addCase(logout.fulfilled, state =>{
        state.user = null;
        state.status = 'idle';
        state.error = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, state =>{
        state.status = 'failed',
        state.error = 'Đăng xuất không thành công.'
      })
  },
});

export const { setUser, setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
