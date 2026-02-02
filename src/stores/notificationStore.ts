import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

interface NotificationFilters {
  type: string;
  dateFrom: string;
  dateTo: string;
}

interface NotificationActions {
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  toggleImportant: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (_filters) => {
    set({ loading: true, error: null });
    try {
      const notifications = await invoke<Notification[]>('get_notifications');
      const unreadCount = notifications.filter(n => !n.isRead).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ error: String(error), loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await invoke('update_notification', { id, input: { isRead: true } });
      set({
        notifications: get().notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await invoke('mark_all_notifications_read');
      set({
        notifications: get().notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  toggleImportant: async (id) => {
    const notification = get().notifications.find(n => n.id === id);
    if (!notification) return;

    try {
      await invoke('update_notification', {
        id,
        input: { isImportant: !notification.isImportant }
      });
      set({
        notifications: get().notifications.map(n =>
          n.id === id ? { ...n, isImportant: !n.isImportant } : n
        ),
      });
    } catch (error) {
      console.error('Failed to toggle important:', error);
    }
  },

  deleteNotification: async (id) => {
    try {
      await invoke('delete_notification', { id });
      const notification = get().notifications.find(n => n.id === id);
      set({
        notifications: get().notifications.filter(n => n.id !== id),
        unreadCount: notification && !notification.isRead
          ? get().unreadCount - 1
          : get().unreadCount,
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },
}));
