import { create } from 'zustand';
import type { Page, Toast, ToastType } from '../types';

interface UIState {
  currentPage: Page;
  sidebarExpanded: boolean;
  activeModal: string | null;
  toast: Toast | null;
}

interface UIActions {
  setPage: (page: Page) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  currentPage: 'dashboard',
  sidebarExpanded: true,
  activeModal: null,
  toast: null,

  setPage: (page) => set({ currentPage: page }),

  toggleSidebar: () => set((state) => ({
    sidebarExpanded: !state.sidebarExpanded
  })),

  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),

  openModal: (modalId) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),

  showToast: (type, message) => {
    set({ toast: { type, message } });
    // Auto-hide after 3 seconds
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null }),
}));
