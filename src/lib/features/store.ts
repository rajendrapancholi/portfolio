import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import blogReducer from "./blog/blogSlice";
import { authApi } from "./auth/authApi";

export const makeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      blog: blogReducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([authApi.middleware]),
    preloadedState,
  });
};

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
