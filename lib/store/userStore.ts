
// "use client";
// import { create } from 'zustand';
// import { UserState } from '../@type';


// const getTokenFromLocalStorage = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('jwtToken');
//   }
//   return null;
// };

// export const useUserStore = create<UserState>((set) => ({
//   user: null,
//   isLogin: false,
//   token: getTokenFromLocalStorage(),
//   login: (user) => set({ user, isLogin: true }),
//   logout: () => set({ user: null, isLogin: false }),
//   setToken: (token) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('jwtToken', token);
//     }
//     set({ token });
//   },
//   removeToken: () => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('jwtToken');
//     }
//     set({ token: null });
//   },
// }));
// stores/useUserStore.ts
"use client";
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserState } from '../@type';

// Функция для безопасного доступа к localStorage только на клиенте
const getTokenFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwtToken');
  }
  return null;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLogin: false,
        token: getTokenFromLocalStorage(),
        login: (user) => set({ user, isLogin: true }),
        logout: () => {
          set({ user: null, isLogin: false })
          set({ token: null });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('jwtToken');
          }
        },
        setToken: (token) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('jwtToken', token);
          }
          set({ token });
        },
      }),
      {
        name: 'user-store', // имя для сохранения состояния в localStorage
      }
    ),
    { name: 'UserStore' } // имя для DevTools
  )
);


