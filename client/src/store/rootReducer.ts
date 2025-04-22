// store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlide'
import eventSlice from './eventSlide'
import socketSlice from './socketSlide'
const rootReducer = combineReducers({
  user : authSlice ,
  events: eventSlice ,
  socket: socketSlice
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
