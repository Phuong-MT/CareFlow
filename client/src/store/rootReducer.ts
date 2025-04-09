// store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlide'

const rootReducer = combineReducers({
  user : authSlice || undefined,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
