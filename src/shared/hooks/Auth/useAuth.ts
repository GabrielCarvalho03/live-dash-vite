import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean | null; // null = validando
  setAuth: (auth: boolean) => void;
  logout: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  refreshToken: null,
  setRefreshToken: (refreshToken) => set({ refreshToken }),

  isAuthenticated: null,
  setAuth: (auth) => set({ isAuthenticated: auth }),
  logout: () => set({ isAuthenticated: false }),
}));
