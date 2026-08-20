"use client";
import { create } from 'zustand';
import { NotificationCategory, NotificationItem, NotificationQueryParams } from '@/lib/types/notifications';
import { GetNotifications, GetUnreadNotificationsCount, MarkAllNotificationsAsRead, MarkNotificationAsRead } from '@/lib/api/config-api';

interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    hasMore: boolean;
    categoryFilter?: NotificationCategory;
    unreadFilter?: boolean;

    fetchNotifications: (params?: NotificationQueryParams, append?: boolean) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    loadMore: () => Promise<void>;
    setFilterCategory: (category?: NotificationCategory) => Promise<void>;
    setFilterUnread: (unread?: boolean) => Promise<void>;
    resetFilters: () => Promise<void>;
    setNotifications: (notifications: NotificationItem[], unreadCount?: number) => void;
    addNotification: (notification: NotificationItem) => void;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    page: 1,
    pageSize: 20,
    hasMore: false,
    categoryFilter: undefined,
    unreadFilter: undefined,

    fetchNotifications: async (params?: NotificationQueryParams, append: boolean = false) => {
        const state = get();
        const currentPage = params?.page ?? (append ? state.page : 1);
        const currentPageSize = params?.pageSize ?? state.pageSize;
        
        // If append=true (loadMore), keep existing filter states unless provided.
        // Otherwise, use the explicitly provided filters (clearing previous filters if undefined in params).
        const currentCategory = append ? (params?.category ?? state.categoryFilter) : params?.category;
        const currentUnread = append ? (params?.unread ?? state.unreadFilter) : params?.unread;

        set(append ? { isLoadingMore: true, error: null } : { isLoading: true, error: null });

        try {
            const response = await GetNotifications({
                page: currentPage,
                pageSize: currentPageSize,
                category: currentCategory,
                unread: currentUnread
            });

            const data = response?.data;
            if (!data) {
                set({ isLoading: false, isLoadingMore: false });
                return;
            }

            const items = data.items || [];
            set({
                notifications: append ? [...state.notifications, ...items] : items,
                unreadCount: data.unreadCount ?? state.unreadCount,
                page: currentPage,
                pageSize: currentPageSize,
                categoryFilter: currentCategory,
                unreadFilter: currentUnread,
                hasMore: items.length === currentPageSize,
                isLoading: false,
                isLoadingMore: false
            });
        } catch (error: any) {
            console.error('[NotificationStore] Error fetching notifications:', error);
            set({
                error: error.message || 'Error al cargar notificaciones',
                isLoading: false,
                isLoadingMore: false
            });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const response = await GetUnreadNotificationsCount();
            if (response?.data) {
                set({ unreadCount: response.data.count });
            }
        } catch (error) {
            console.error('[NotificationStore] Error fetching unread count:', error);
        }
    },

    loadMore: async () => {
        const state = get();
        if (state.isLoadingMore || !state.hasMore) return;
        const nextPage = state.page + 1;
        await state.fetchNotifications({ page: nextPage }, true);
    },

    setFilterCategory: async (category?: NotificationCategory) => {
        const state = get();
        set({ categoryFilter: category, page: 1 });
        await state.fetchNotifications({
            category,
            unread: state.unreadFilter,
            page: 1,
            pageSize: state.pageSize
        }, false);
    },

    setFilterUnread: async (unread?: boolean) => {
        const state = get();
        set({ unreadFilter: unread, page: 1 });
        await state.fetchNotifications({
            category: state.categoryFilter,
            unread,
            page: 1,
            pageSize: state.pageSize
        }, false);
    },

    resetFilters: async () => {
        const state = get();
        set({ categoryFilter: undefined, unreadFilter: undefined, page: 1 });
        await state.fetchNotifications({
            category: undefined,
            unread: undefined,
            page: 1,
            pageSize: state.pageSize
        }, false);
    },

    setNotifications: (notifications, unreadCount) => {
        const count = unreadCount ?? notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount: count });
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
        }));
    },

    markAsRead: async (id: number) => {
        const state = get();
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.isRead;

        set({
            notifications: state.notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        });

        try {
            await MarkNotificationAsRead(id);
            // Refrescar conteo real
            state.fetchUnreadCount();
        } catch (error) {
            console.error('[NotificationStore] Error marking notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true })),
            unreadCount: 0
        }));

        try {
            await MarkAllNotificationsAsRead();
            get().fetchUnreadCount();
        } catch (error) {
            console.error('[NotificationStore] Error marking all notifications as read:', error);
        }
    },

    getUnreadCount: () => get().unreadCount
}));
