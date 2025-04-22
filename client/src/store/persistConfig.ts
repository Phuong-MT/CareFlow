// store/persistConfig.ts
import storage from 'redux-persist/lib/storage'; // default: localStorage for web
import { PersistConfig } from 'redux-persist';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user', 'events','socket'], 
};

export default persistConfig;
