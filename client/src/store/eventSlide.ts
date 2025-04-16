import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiGetAllEvents} from '@/services/eventServices';
import { Event, EventRequest, EventState } from '@/types/eventTypes';

export const initialState: EventState = {
    events: null,
    status: 'idle',
    error: null
};

export const getAllEvents = createAsyncThunk<EventState,EventRequest, {rejectValue: string} >(' events/getAllEvents', async(payload,{rejectWithValue})=>{
  try{
    const response = await apiGetAllEvents(payload);
    console.log(response.data)
    return response.data;
  }catch(err: any){
    const message = err.response?.data?.message || 'GetEventAll thất bại'
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
        state.events = action.payload.events
        state.error = null
      })
      .addCase(getAllEvents.rejected, (state, action)=>{
        state.status = 'failed',
        state.error = action.payload || ' getAllEvent failed',
        state.events = null 
      })
  }
});


export const { setEvent } = EventsSlice.actions;
export default EventsSlice.reducer