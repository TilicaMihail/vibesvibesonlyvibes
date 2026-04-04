import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  toasts: Toast[];
  darkMode: boolean;
}

function getInitialState(): UIState {
  const darkMode =
    typeof window !== 'undefined'
      ? localStorage.getItem('darkMode') === 'true'
      : false;

  const sidebarCollapsed =
    typeof window !== 'undefined'
      ? localStorage.getItem('sidebarCollapsed') === 'true'
      : false;

  return {
    sidebarOpen: false,
    sidebarCollapsed,
    activeModal: null,
    toasts: [],
    darkMode,
  };
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: getInitialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      const id = Math.random().toString(36).slice(2);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarCollapsed', String(state.sidebarCollapsed));
      }
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', String(state.darkMode));
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addToast,
  removeToast,
  toggleSidebarCollapsed,
  toggleDarkMode,
} = uiSlice.actions;
export default uiSlice.reducer;
