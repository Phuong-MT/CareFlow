
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { apiGetPocAssignments } from '@/services/pocAssignmentService';
import { PocAssignment,PocUser,ResponsePOC } from '@/types/pocTypes';
import {apiGetPocUser} from '@/services/authServices'

export const initialState: ResponsePOC = {
    dataPocAssignment: [],
    status: 'idle',
    error: ''
};

export const getAssignments = createAsyncThunk<PocAssignment[], void,{ rejectValue: string }>('poc/get-poc-assignment', async (_,thunkAPI) => {
    try {
      const res = await apiGetPocAssignments()
      return res
    } catch (err: any) {
      const message = err.response?.data?.message || 'POC get thất bại'
      return thunkAPI.rejectWithValue(message as string)
    }
  });
const getPocUser = createAsyncThunk<PocUser[], void, { rejectValue: string }>('poc/get-poc-user', async (_, thunkAPI) => {
    try{
        const res = await apiGetPocUser()
        return res
    }catch(error: any){
        const message = error.response?.data?.message || 'POC get thất bại'
        return thunkAPI.rejectWithValue(message as string)
    }
})
const pocAssignmentSlice = createSlice({
    name: 'pocAssignment',
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
            });
    },
});
export const { setPocAssignment } = pocAssignmentSlice.actions;
export default pocAssignmentSlice.reducer;