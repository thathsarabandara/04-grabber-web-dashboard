import { create } from 'zustand';

// Auth Store (alternative to Redux)

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem('authToken');
      set({ token: null, isAuthenticated: false, user: null });
    }
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ token: null, isAuthenticated: false, user: null });
  },
}));
