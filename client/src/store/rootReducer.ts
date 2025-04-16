// store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlide'
import eventSlice from './eventSlide'

const rootReducer = combineReducers({
  user : authSlice ,
  events: eventSlice ,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
