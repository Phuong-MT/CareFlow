import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiGetAllEvents} from '@/services/eventServices';
import { ResponseAnalytics , DataSchema} from '@/types/analyticsTypes';
import { apiAnalyticsDaily } from '@/services/analyticsService';
export const initialState: ResponseAnalytics = {
    dataAnalytics: [],
    status: 'idle',
    error: ''
};

export const postAnalyticsDaily = createAsyncThunk<DataSchema[], string,{ rejectValue: string }>('analytics/postAnalyticsDaily', async (payload, { rejectWithValue }) => {
    try {
       const validPayload = {
        numDays : payload
       } 
      const res = await apiAnalyticsDaily(validPayload)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || 'postAnalyticsDaily thất bại'
      return rejectWithValue(message)
    }
  });
const AnalyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalytics(state, action: PayloadAction<ResponseAnalytics>){
      state.status = 'idle',
      state.dataAnalytics = action.payload.dataAnalytics
    }
  },
  extraReducers: builder=>{
    builder
     .addCase(postAnalyticsDaily.pending,state=>{
            state.status = 'loading';
            state.error = ''; 
     })
     .addCase(postAnalyticsDaily.fulfilled, (state, action)=>{
        state.status = 'success',
        state.dataAnalytics = action.payload
     })
     .addCase(postAnalyticsDaily.rejected, (state, action)=>{
        state.status = 'failed',
        state.dataAnalytics = [],
        state.error = action.payload ??'postAnalyticsDaily thất bại'
     })
  }
});


export const { setAnalytics } = AnalyticsSlice.actions;
export default AnalyticsSlice.reducer