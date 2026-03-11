"use client";
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserState } from '../@type';

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLogin: false,
        token: null,
        _hasHydrated: false,
        login: (user, token) => set({ user, token, isLogin: true }),
        logout: () => {
          set({ user: null, isLogin: false, token: null });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('refresh_token');
          }
        },
        setToken: (token) => {
          set({ token });
        },
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        }
      }),
      {
        name: 'user-store',
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.log('Error during hydration:', error);
            }
            // Always set hydrated to true, even if there was no stored data
            if (state) {
              state.setHasHydrated(true);
            }
          }
        }
      }
    ),
    { name: 'UserStore' }
  )
);
