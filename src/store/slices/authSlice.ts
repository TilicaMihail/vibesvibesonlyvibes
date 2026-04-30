import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserPublic } from '@/types';

function getInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false, isLoading: false, error: null };
  }
  try {
    const token = localStorage.getItem('auth_token');
    const userRaw = localStorage.getItem('auth_user');
    const user: UserPublic | null = userRaw ? (JSON.parse(userRaw) as UserPublic) : null;
    if (token && user) {
      return { user, token, isAuthenticated: true, isLoading: false, error: null };
    }
  } catch {
    // ignore parse errors
  }
  return { user: null, token: null, isAuthenticated: false, isLoading: false, error: null };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: UserPublic; token: string }>) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, setToken, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
