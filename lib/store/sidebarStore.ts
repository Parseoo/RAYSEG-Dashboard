"use client";
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        isCollapsed: false,
        toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
        setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
      }),
      {
        name: 'sidebar-store',
      }
    ),
    { name: 'SidebarStore' }
  )
);
