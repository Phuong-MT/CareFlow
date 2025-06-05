import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiGetAllEvents, apiGetAllEventsUserCanSee} from '@/services/eventServices';
import {EventApiResponse, EventRequest, EventState } from '@/types/eventTypes';
import { get } from 'http';
export const initialState: EventState = {
    events: null,
    status: 'idle',
    error: null,
    pagination:{
        page: 1,
        limit: 10,
        total: 0
    }
};

export const getAllEvents = createAsyncThunk<EventApiResponse,EventRequest, {rejectValue: string} >(' events/getAllEvents', async(payload,{rejectWithValue})=>{
  try{
    const response = await apiGetAllEvents(payload);
    console.log(response.data)
    return response.data;
  }catch(err: any){
    const message = err.response?.data?.message || 'GetEventAll thất bại'
    return rejectWithValue(message)
  }
})

export const getAllEventsUserCanSee = createAsyncThunk<EventApiResponse, EventRequest, {rejectValue: string}>('events/getAllEventsUserCanSee', async(payload, {rejectWithValue})=>{
  try{
    const response = await apiGetAllEventsUserCanSee(payload);
    return response.data;
  }catch(err: any){
    const message = err.response?.data?.message || 'GetAllEventsUserCanSee thất bại'
    return rejectWithValue(message)
  }
})

const EventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvent(state, action: PayloadAction<EventState>){
      state.status = 'idle',
      state.events = action.payload.events
    }
  },
  extraReducers: builder=>{
    builder
      .addCase(getAllEvents.pending, (state)=>{
        state.status = 'loading'
      })
      .addCase(getAllEvents.fulfilled, (state, action)=>{
        state.status = 'succeeded',
        state.events = action.payload.events,
        state.pagination = {
            total: action.payload.total ,
            page: action.payload.page,
            limit: action.payload.limit,
          };
        state.error = null
      })
      .addCase(getAllEvents.rejected, (state, action)=>{
        state.status = 'failed',
        state.error = action.payload || ' getAllEvent failed',
        state.events = null 
      })
      .addCase(getAllEventsUserCanSee.pending, state=>{
        state.status = 'loading',
        state.error = null
      })
      .addCase(getAllEventsUserCanSee.fulfilled, (state, action)=>{
        state.status = 'succeeded',
        state.events = action.payload.events,
        state.pagination = {
            total: action.payload.total ,
            page: action.payload.page,
            limit: action.payload.limit,
          };
        state.error = null
      })
  }
});


export const { setEvent } = EventsSlice.actions;
export const eventReducer = EventsSlice.reducer;