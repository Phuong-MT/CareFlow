// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketState, ResponseQueue } from '@/types/socketTypes';

const initialState: SocketState = {
  isConnected: false,
  socketId: null,
  queueState: []
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = true;
      state.socketId = action.payload;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
    },
    setQueueState:(state, action:PayloadAction<ResponseQueue[]>)=>{
        state.queueState = action.payload
    }, 
    addQueueState:(state, action:PayloadAction<ResponseQueue>)=>{
        state.queueState.push(action.payload)
    }
  },
});

export const { setConnected, setDisconnected, setQueueState, addQueueState} = socketSlice.actions;
export default socketSlice.reducer;
