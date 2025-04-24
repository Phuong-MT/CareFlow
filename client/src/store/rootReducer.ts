// store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlide'
import eventSlice from './eventSlide'
import socketSlice from './socketSlide'
import analyticsSlice from './analyticsSlide'
const rootReducer = combineReducers({
  user : authSlice ,
  events: eventSlice ,
  socket: socketSlice,
  analytics : analyticsSlice
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
