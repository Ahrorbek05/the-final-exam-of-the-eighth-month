import { configureStore } from '@reduxjs/toolkit';
import spotifyReducer from '../features/spotifySlice';

export const store = configureStore({
  reducer: {
    spotify: spotifyReducer,
  },
});
