"use client";
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserState } from '../@type';

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLogin: false,
        token: null,
        _hasHydrated: false,
        isSessionExpired: false,
        login: (user: User, token: string) => set({ user, token, isLogin: true, isSessionExpired: false }),
        logout: () => {
          set({ user: null, isLogin: false, token: null });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('refresh_token');
          }
        },
        setToken: (token: string) => {
          set({ token });
        },
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        },
        setSessionExpired: (state) => set({ isSessionExpired: state })
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
            } else {
              useUserStore.setState({ _hasHydrated: true });
            }
          }
        }
      }
    ),
    { name: 'UserStore' }
  )
);
