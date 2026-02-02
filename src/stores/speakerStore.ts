import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Speaker, CreateSpeakerInput, VoiceSample } from '../types';

interface SpeakerState {
  speakers: Speaker[];
  currentSpeaker: Speaker | null;
  voiceSamples: VoiceSample[];
  loading: boolean;
  error: string | null;
}

interface SpeakerActions {
  fetchSpeakers: () => Promise<void>;
  createSpeaker: (input: CreateSpeakerInput) => Promise<Speaker>;
  updateSpeaker: (id: number, input: Partial<CreateSpeakerInput>) => Promise<void>;
  deleteSpeaker: (id: number) => Promise<void>;
  setCurrentSpeaker: (speaker: Speaker | null) => void;
  fetchVoiceSamples: (speakerId: number) => Promise<void>;
}

export const useSpeakerStore = create<SpeakerState & SpeakerActions>((set, get) => ({
  speakers: [],
  currentSpeaker: null,
  voiceSamples: [],
  loading: false,
  error: null,

  fetchSpeakers: async () => {
    set({ loading: true, error: null });
    try {
      const speakers = await invoke<Speaker[]>('get_speakers');
      set({ speakers, loading: false });
    } catch (error) {
      console.error('Failed to fetch speakers:', error);
      set({ error: String(error), loading: false });
    }
  },

  createSpeaker: async (input) => {
    set({ loading: true });
    try {
      const speaker = await invoke<Speaker>('create_speaker', { input });
      set({ speakers: [...get().speakers, speaker], loading: false });
      return speaker;
    } catch (error) {
      set({ error: String(error), loading: false });
      throw error;
    }
  },

  updateSpeaker: async (id, input) => {
    try {
      const updated = await invoke<Speaker>('update_speaker', { id, input });
      set({
        speakers: get().speakers.map(s => s.id === id ? updated : s),
        currentSpeaker: get().currentSpeaker?.id === id ? updated : get().currentSpeaker,
      });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  deleteSpeaker: async (id) => {
    try {
      await invoke('delete_speaker', { id });
      set({
        speakers: get().speakers.filter(s => s.id !== id),
        currentSpeaker: get().currentSpeaker?.id === id ? null : get().currentSpeaker,
      });
    } catch (error) {
      set({ error: String(error) });
      throw error;
    }
  },

  setCurrentSpeaker: (speaker) => {
    set({ currentSpeaker: speaker, voiceSamples: [] });
    if (speaker) {
      get().fetchVoiceSamples(speaker.id);
    }
  },

  fetchVoiceSamples: async (speakerId) => {
    try {
      const voiceSamples = await invoke<VoiceSample[]>('get_voice_samples', { speakerId });
      set({ voiceSamples });
    } catch (error) {
      console.error('Failed to fetch voice samples:', error);
    }
  },
}));
