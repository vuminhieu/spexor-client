import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { TranscriptSegment, AudioFile } from '../types';

interface AudioState {
  // Current audio
  currentAudioId: number | null;
  currentAudioFile: AudioFile | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;

  // Transcript
  segments: TranscriptSegment[];
  activeSegmentId: number | null;
  deletedSegmentIds: number[];

  loading: boolean;
}

interface AudioActions {
  // Playback
  setCurrentAudio: (audioId: number | null) => void;
  setCurrentAudioFile: (audioFile: AudioFile | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  skip: (seconds: number) => void;
  reset: () => void;

  // Transcript
  fetchSegments: (audioFileId: number) => Promise<void>;
  setActiveSegment: (id: number | null) => void;
  deleteSegment: (id: number) => void;
  restoreAllSegments: () => void;
  updateSegmentText: (id: number, text: string) => Promise<void>;
  assignSpeaker: (segmentId: number, speakerId: number) => Promise<void>;
}

export const useAudioStore = create<AudioState & AudioActions>((set, get) => ({
  currentAudioId: null,
  currentAudioFile: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackSpeed: 1,
  segments: [],
  activeSegmentId: null,
  deletedSegmentIds: [],
  loading: false,

  // Playback controls
  setCurrentAudio: (audioId) => {
    set({
      currentAudioId: audioId,
      currentTime: 0,
      isPlaying: false,
      segments: [],
      activeSegmentId: null,
      deletedSegmentIds: [],
    });
    if (audioId) {
      get().fetchSegments(audioId);
    }
  },

  setCurrentAudioFile: (audioFile) => {
    set({ currentAudioFile: audioFile });
    if (audioFile) {
      set({
        currentAudioId: audioFile.id,
        duration: audioFile.duration,
      });
      get().fetchSegments(audioFile.id);
    }
  },

  reset: () => set({
    currentAudioId: null,
    currentAudioFile: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    segments: [],
    activeSegmentId: null,
    deletedSegmentIds: [],
  }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  skip: (seconds) => set((state) => ({
    currentTime: Math.max(0, Math.min(state.duration, state.currentTime + seconds)),
  })),

  // Transcript
  fetchSegments: async (audioFileId) => {
    set({ loading: true });
    try {
      const segments = await invoke<TranscriptSegment[]>('get_transcript_segments', { audioFileId });
      set({ segments, loading: false });
    } catch (error) {
      console.error('Failed to fetch segments:', error);
      set({ loading: false });
    }
  },

  setActiveSegment: (id) => set({ activeSegmentId: id }),

  deleteSegment: (id) => set((state) => ({
    deletedSegmentIds: [...state.deletedSegmentIds, id],
  })),

  restoreAllSegments: () => set({ deletedSegmentIds: [] }),

  updateSegmentText: async (id, text) => {
    try {
      await invoke('update_transcript_segment', { id, input: { text } });
      set({
        segments: get().segments.map(s =>
          s.id === id ? { ...s, text } : s
        ),
      });
    } catch (error) {
      console.error('Failed to update segment:', error);
      throw error;
    }
  },

  assignSpeaker: async (segmentId, speakerId) => {
    try {
      await invoke('update_transcript_segment', { id: segmentId, input: { speakerId } });
      set({
        segments: get().segments.map(s =>
          s.id === segmentId ? { ...s, speakerId } : s
        ),
      });
    } catch (error) {
      console.error('Failed to assign speaker:', error);
      throw error;
    }
  },
}));
