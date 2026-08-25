import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { User, AuthState, EditableUserProfile } from "@/types/auth.types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  registeredUsers: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (
      state,
      action: PayloadAction<{ user: User; passwordHash: string }>
    ) => {
      const exists = state.registeredUsers.some(
        (u) => u.email === action.payload.user.email
      );
      if (!exists) {
        state.registeredUsers.push({
          ...action.payload.user,
          passwordHash: action.payload.passwordHash,
        });
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    },
    login: (
      state,
      action: PayloadAction<{ email: string; passwordHash: string }>
    ) => {
      const found = state.registeredUsers.find(
        (u) =>
          u.email === action.payload.email &&
          u.passwordHash === action.payload.passwordHash
      );
      if (found) {
        const { passwordHash: _, ...user } = found;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action: PayloadAction<EditableUserProfile>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const idx = state.registeredUsers.findIndex(
          (u) => u.id === state.user!.id
        );
        if (idx !== -1) {
          state.registeredUsers[idx] = {
            ...state.registeredUsers[idx],
            ...action.payload,
          };
        }
      }
    },
  },
});

export const { registerUser, login, logout, updateProfile } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectRegisteredUsers = (state: RootState) =>
  state.auth.registeredUsers;

export default authSlice.reducer;
