import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import type { PersistPartial } from 'redux-persist/es/persistReducer';
import type { Reducer } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'events'],
};

type RootReducerType = ReturnType<typeof rootReducer>;
type PersistedReducer = Reducer<RootReducerType & PersistPartial>;

const persistedReducer = persistReducer(persistConfig, rootReducer) as PersistedReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];