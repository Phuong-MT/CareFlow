import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {ResponsePOC, PocAssignmentType, PocUser} from '@/types/pocTypes';
import { apiGetPocAssignments, apiGetPocUser } from '@/services/pocAssignmentService';

export const initialState:ResponsePOC = {
    dataPocAssignment:[],
    dataPocUser:[],
    status:'idle',
    error:''
}
export const getAssignments = createAsyncThunk<PocAssignmentType[], void,{ rejectValue: string }>('poc/get-poc-assignment', async (_,thunkAPI) => {
    try {
      const res = await apiGetPocAssignments()
      return res
    } catch (err: any) {
      const message = err.response?.data?.message || 'POC get thất bại'
      return thunkAPI.rejectWithValue(message as string)
    }
  });
export const getPocUser = createAsyncThunk<PocUser[], void, { rejectValue: string }>('poc/get-poc-all', async (_, thunkAPI) => {
    try{
        const res = await apiGetPocUser()
        return res
    }catch(error: any){
        const message = error.response?.data?.message || 'POC get thất bại'
        return thunkAPI.rejectWithValue(message as string)
    }
})
const pocAssignmentSlice = createSlice({
    name: 'poc',
    initialState,
    reducers: {
        setPocAssignment(state, action) {
            state.dataPocAssignment = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAssignments.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(getAssignments.fulfilled, (state, action) => {
                state.status = 'success';
                state.dataPocAssignment = action.payload;
            })
            .addCase(getAssignments.rejected, (state, action) => {
                state.status = 'failed';
                state.dataPocAssignment = [];
                state.error = action.payload ?? 'POC get thất bại';
            })
            .addCase(getPocUser.pending,(state)=>{
                state.status = 'loading';
                state.error = '';
            })
            .addCase(getPocUser.fulfilled, (state, action)=>{
                state.status = 'success';
                state.dataPocUser = action.payload;
            })
            .addCase(getPocUser.rejected,(state, action)=>{
                state.status = 'failed';
                state.dataPocUser = [];
                state.error = action.payload ?? 'POC get thất bại';
            })
    },
});
export const { setPocAssignment } = pocAssignmentSlice.actions;
export default pocAssignmentSlice.reducer;