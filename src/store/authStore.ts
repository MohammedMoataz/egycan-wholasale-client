import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      isTokenExpired: () => {
        const { accessToken } = get();
        if (!accessToken) return true;

        try {
          const decoded = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          return decoded.exp ? decoded.exp < currentTime : true;
        } catch (error) {
          console.log(error);
          return true;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);