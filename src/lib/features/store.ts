import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import blogReducer from './blog/blogSlice';

export const makeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      blog: blogReducer,
    },
    preloadedState,
  });
};

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
