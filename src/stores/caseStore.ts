import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Case, CreateCaseInput, UpdateCaseInput, AudioFile } from '../types';

interface CaseState {
  cases: Case[];
  currentCase: Case | null;
  audioFiles: AudioFile[];
  loading: boolean;
  error: string | null;
}

interface CaseActions {
  fetchCases: () => Promise<void>;
  createCase: (input: CreateCaseInput) => Promise<Case>;
  updateCase: (id: number, input: UpdateCaseInput) => Promise<void>;
  deleteCase: (id: number) => Promise<void>;
  setCurrentCase: (caseItem: Case | null) => void;
  fetchAudioFiles: (caseId: number) => Promise<void>;
  clearError: () => void;
}

export const useCaseStore = create<CaseState & CaseActions>((set, get) => ({
  cases: [],
  currentCase: null,
  audioFiles: [],
  loading: false,
  error: null,

  fetchCases: async () => {
    set({ loading: true, error: null });
    try {
      const cases = await invoke<Case[]>('get_cases');
      set({ cases, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  createCase: async (input) => {
    set({ loading: true, error: null });
    try {
      const newCase = await invoke<Case>('create_case', { input });
      set({ cases: [...get().cases, newCase], loading: false });
      return newCase;
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  updateCase: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const updated = await invoke<Case>('update_case', { id, input });
      set({
        cases: get().cases.map(c => c.id === id ? updated : c),
        currentCase: get().currentCase?.id === id ? updated : get().currentCase,
        loading: false,
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  deleteCase: async (id) => {
    set({ loading: true, error: null });
    try {
      await invoke('delete_case', { id });
      set({
        cases: get().cases.filter(c => c.id !== id),
        currentCase: get().currentCase?.id === id ? null : get().currentCase,
        loading: false,
      });
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  setCurrentCase: (caseItem) => {
    set({ currentCase: caseItem, audioFiles: [] });
    if (caseItem) {
      get().fetchAudioFiles(caseItem.id);
    }
  },

  fetchAudioFiles: async (caseId) => {
    try {
      const audioFiles = await invoke<AudioFile[]>('get_audio_files', { caseId });
      set({ audioFiles });
    } catch (error) {
      console.error('Failed to fetch audio files:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
