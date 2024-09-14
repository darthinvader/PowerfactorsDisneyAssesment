import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from './characterSlice';

const store = configureStore({
  reducer: {
    characters: charactersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
