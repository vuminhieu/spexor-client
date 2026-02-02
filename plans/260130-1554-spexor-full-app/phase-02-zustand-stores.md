---
description: Zustand Stores & State Management Setup
status: done
priority: P1
effort: 3h
---

# Phase 02: Zustand Stores & State Management

## Context

- Parent Plan: [plan.md](plan.md)
- Depends on: [Phase 01](phase-01-database-setup.md) for type definitions

## Overview

Set up Zustand state management with stores for all entities. Implement Tauri command integration pattern.

## Key Insights

- Zustand v5 with TypeScript support
- Separate stores per domain (cases, audio, speakers, etc.)
- Shared hook pattern for Tauri commands
- Persist some state with zustand/persist

## Requirements

- [ ] Install Zustand
- [ ] Create store for each entity
- [ ] Implement Tauri command hooks
- [ ] Set up persist middleware for settings
- [ ] Create typed store hooks

## Architecture

```
src/stores/
├── index.ts           # Barrel export
├── caseStore.ts       # Case management
├── audioStore.ts      # Audio & transcript
├── speakerStore.ts    # Speaker management
├── vocabularyStore.ts # Alert & replacement words
├── userStore.ts       # User management
├── notificationStore.ts
├── activityStore.ts
├── uiStore.ts         # UI state (sidebar, modals)
└── settingsStore.ts   # App settings (persisted)
```

## Related Files

```
src/
├── stores/
│   └── *.ts
├── types/
│   └── index.ts       # Shared TypeScript types
└── hooks/
    └── use-tauri.ts   # Tauri command hook
```

## Implementation Steps

### Step 1: Install Zustand
```bash
npm install zustand
```

### Step 2: Create TypeScript types
```typescript
// src/types/index.ts

// Case types
export interface Case {
  id: number;
  code: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseInput {
  code: string;
  title: string;
  description?: string;
}

// Audio types
export interface AudioFile {
  id: number;
  caseId: number;
  fileName: string;
  filePath: string;
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: string;
}

export interface TranscriptSegment {
  id: number;
  audioFileId: number;
  speakerId: number | null;
  startTime: number;
  endTime: number;
  text: string;
  isDeleted: boolean;
  createdAt: string;
}

// Speaker types
export interface Speaker {
  id: number;
  name: string;
  alias: string | null;
  gender: string | null;
  ageEstimate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface VoiceSample {
  id: number;
  speakerId: number;
  fileName: string;
  filePath: string;
  duration: number;
  createdAt: string;
}

// Vocabulary types
export interface AlertWord {
  id: number;
  keyword: string;
  category: string;
  description: string | null;
  createdAt: string;
}

export interface ReplacementWord {
  id: number;
  original: string;
  correct: string;
  category: string;
  createdAt: string;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'investigator' | 'viewer';
  avatar: string | null;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: number;
  type: 'alert' | 'success' | 'crud' | 'system';
  action: string;
  title: string;
  message: string | null;
  entityType: string | null;
  entityId: number | null;
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
}

// Activity log types
export interface ActivityLog {
  id: number;
  userId: number | null;
  action: string;
  targetType: string;
  targetId: number | null;
  details: string | null;
  createdAt: string;
}
```

### Step 3: Create Case Store
```typescript
// src/stores/caseStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Case, CreateCaseInput, AudioFile } from '../types';

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
  updateCase: (id: number, input: Partial<CreateCaseInput>) => Promise<void>;
  deleteCase: (id: number) => Promise<void>;
  setCurrentCase: (caseItem: Case | null) => void;
  fetchAudioFiles: (caseId: number) => Promise<void>;
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
}));
```

### Step 4: Create UI Store
```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';

type Page = 'dashboard' | 'cases' | 'workspace' | 'users' | 'speakers' | 
            'alert-words' | 'replacements' | 'logs' | 'notifications' | 'support';

interface UIState {
  currentPage: Page;
  sidebarExpanded: boolean;
  activeModal: string | null;
  toast: { type: 'success' | 'error' | 'info'; message: string } | null;
}

interface UIActions {
  setPage: (page: Page) => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  currentPage: 'dashboard',
  sidebarExpanded: true,
  activeModal: null,
  toast: null,

  setPage: (page) => set({ currentPage: page }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  showToast: (type, message) => {
    set({ toast: { type, message } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  hideToast: () => set({ toast: null }),
}));
```

### Step 5: Create Settings Store (persisted)
```typescript
// src/stores/settingsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ImportantEvents {
  alert: boolean;
  success: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  import: boolean;
  login: boolean;
}

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  importantEvents: ImportantEvents;
}

interface SettingsActions {
  setTheme: (theme: 'light' | 'dark') => void;
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

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      updateImportantEvents: (events) => set((state) => ({
        importantEvents: { ...state.importantEvents, ...events },
      })),
      resetImportantEvents: () => set({ importantEvents: defaultImportantEvents }),
    }),
    {
      name: 'spexor-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Step 6: Create Speaker Store
```typescript
// src/stores/speakerStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Speaker, VoiceSample } from '../types';

interface SpeakerState {
  speakers: Speaker[];
  currentSpeaker: Speaker | null;
  voiceSamples: VoiceSample[];
  loading: boolean;
}

interface SpeakerActions {
  fetchSpeakers: () => Promise<void>;
  createSpeaker: (input: Partial<Speaker>) => Promise<Speaker>;
  updateSpeaker: (id: number, input: Partial<Speaker>) => Promise<void>;
  deleteSpeaker: (id: number) => Promise<void>;
  setCurrentSpeaker: (speaker: Speaker | null) => void;
}

export const useSpeakerStore = create<SpeakerState & SpeakerActions>((set, get) => ({
  speakers: [],
  currentSpeaker: null,
  voiceSamples: [],
  loading: false,

  fetchSpeakers: async () => {
    set({ loading: true });
    try {
      const speakers = await invoke<Speaker[]>('get_speakers');
      set({ speakers, loading: false });
    } catch (error) {
      console.error('Failed to fetch speakers:', error);
      set({ loading: false });
    }
  },

  createSpeaker: async (input) => {
    const speaker = await invoke<Speaker>('create_speaker', { input });
    set({ speakers: [...get().speakers, speaker] });
    return speaker;
  },

  updateSpeaker: async (id, input) => {
    const updated = await invoke<Speaker>('update_speaker', { id, input });
    set({ speakers: get().speakers.map(s => s.id === id ? updated : s) });
  },

  deleteSpeaker: async (id) => {
    await invoke('delete_speaker', { id });
    set({ speakers: get().speakers.filter(s => s.id !== id) });
  },

  setCurrentSpeaker: (speaker) => set({ currentSpeaker: speaker }),
}));
```

### Step 7: Create barrel export
```typescript
// src/stores/index.ts
export { useCaseStore } from './caseStore';
export { useUIStore } from './uiStore';
export { useSettingsStore } from './settingsStore';
export { useSpeakerStore } from './speakerStore';
// ... export other stores
```

## Todo

- [ ] Install zustand
- [ ] Create types/index.ts with all interfaces
- [ ] Create caseStore.ts
- [ ] Create uiStore.ts
- [ ] Create settingsStore.ts (with persist)
- [ ] Create speakerStore.ts
- [ ] Create vocabularyStore.ts (alertWords + replacements)
- [ ] Create notificationStore.ts
- [ ] Create barrel export index.ts

## Success Criteria

1. ✅ All stores created with proper typing
2. ✅ Settings persist to localStorage
3. ✅ UI store manages navigation and modals
4. ✅ Tauri invoke integrated with stores

## Next Steps

After completing this phase:
1. Proceed to [Phase 03: Rust Commands](phase-03-rust-commands.md)
