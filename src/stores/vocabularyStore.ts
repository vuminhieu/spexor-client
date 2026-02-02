import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { AlertWord, CreateAlertWordInput, ReplacementWord, CreateReplacementWordInput } from '../types';

interface VocabularyState {
  alertWords: AlertWord[];
  replacementWords: ReplacementWord[];
  activeCategory: string;
  loading: boolean;
  error: string | null;
}

interface VocabularyActions {
  // Alert words
  fetchAlertWords: () => Promise<void>;
  createAlertWord: (input: CreateAlertWordInput) => Promise<AlertWord>;
  deleteAlertWord: (id: number) => Promise<void>;

  // Replacement words
  fetchReplacementWords: () => Promise<void>;
  createReplacementWord: (input: CreateReplacementWordInput) => Promise<ReplacementWord>;
  deleteReplacementWord: (id: number) => Promise<void>;

  // Category filter
  setActiveCategory: (category: string) => void;
}

export const useVocabularyStore = create<VocabularyState & VocabularyActions>((set, get) => ({
  alertWords: [],
  replacementWords: [],
  activeCategory: 'Tất cả',
  loading: false,
  error: null,

  // Alert words
  fetchAlertWords: async () => {
    set({ loading: true, error: null });
    try {
      const alertWords = await invoke<AlertWord[]>('get_alert_words');
      set({ alertWords, loading: false });
    } catch (error) {
      console.error('Failed to fetch alert words:', error);
      set({ error: String(error), loading: false });
    }
  },

  createAlertWord: async (input) => {
    try {
      const word = await invoke<AlertWord>('create_alert_word', { input });
      set({ alertWords: [...get().alertWords, word] });
      return word;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  deleteAlertWord: async (id) => {
    try {
      await invoke('delete_alert_word', { id });
      set({ alertWords: get().alertWords.filter(w => w.id !== id) });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  // Replacement words
  fetchReplacementWords: async () => {
    set({ loading: true, error: null });
    try {
      const replacementWords = await invoke<ReplacementWord[]>('get_replacement_words');
      set({ replacementWords, loading: false });
    } catch (error) {
      console.error('Failed to fetch replacement words:', error);
      set({ error: String(error), loading: false });
    }
  },

  createReplacementWord: async (input) => {
    try {
      const word = await invoke<ReplacementWord>('create_replacement_word', { input });
      set({ replacementWords: [...get().replacementWords, word] });
      return word;
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  deleteReplacementWord: async (id) => {
    try {
      await invoke('delete_replacement_word', { id });
      set({ replacementWords: get().replacementWords.filter(w => w.id !== id) });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  setActiveCategory: (category) => set({ activeCategory: category }),
}));
