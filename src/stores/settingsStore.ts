import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ImportantEvents } from '../types';

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  importantEvents: ImportantEvents;
}

interface SettingsActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  updateImportantEvents: (events: Partial<ImportantEvents>) => void;
  resetImportantEvents: () => void;
}

const defaultImportantEvents: ImportantEvents = {
  alert: true,
  success: false,
  create: true,
  update: false,
  delete: true,
  export: false,
  import: false,
  login: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'vi',
      importantEvents: defaultImportantEvents,

      setTheme: (theme) => {
        set({ theme });
        // Update document class for CSS
        document.documentElement.setAttribute('data-theme', theme);
      },

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
      }),

      setLanguage: (language) => set({ language }),

      updateImportantEvents: (events) => set((state) => ({
        importantEvents: { ...state.importantEvents, ...events },
      })),

      resetImportantEvents: () => set({ importantEvents: defaultImportantEvents }),
    }),
    {
      name: 'spexor-settings',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        importantEvents: state.importantEvents,
      }),
    }
  )
);
