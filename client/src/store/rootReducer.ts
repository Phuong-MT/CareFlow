// store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './authSlide';
import { eventReducer } from './eventSlide';
import { socketReducer } from './socketSlide';
import { analyticsReducer } from './analyticsSlide';
import PocAssignmentList from './pocAssignmentSlide';
const rootReducer = combineReducers({
  user : authReducer ,
  events: eventReducer ,
  socket: socketReducer,
  analytics : analyticsReducer,
  poc: PocAssignmentList
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
