import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

interface AuthState {
  user: any | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<any>) {
      state.user = action.payload?.user || null;
      state.status = action.payload ? "authenticated" : "unauthenticated";
    },
    clearCredentials(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getSession.matchFulfilled,
      (state, { payload }) => {
        state.user = payload?.user || null;
        state.status = payload?.user ? "authenticated" : "unauthenticated";
      },
    );
  },
});

export const { clearCredentials, setSession } = authSlice.actions;
export default authSlice.reducer;
