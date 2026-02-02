// TypeScript type definitions for SPEXOR application
// These mirror the Rust models from src-tauri/src/models/

// ============================================
// Case types
// ============================================
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

export interface UpdateCaseInput {
  code?: string;
  title?: string;
  description?: string;
}

// ============================================
// Audio types
// ============================================
export type AudioStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface AudioFile {
  id: number;
  caseId: number;
  fileName: string;
  filePath: string;
  duration: number;
  status: AudioStatus;
  createdAt: string;
}

export interface CreateAudioFileInput {
  caseId: number;
  fileName: string;
  filePath: string;
  duration?: number;
  status?: AudioStatus;
}

// ============================================
// Transcript types
// ============================================
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

export interface CreateTranscriptSegmentInput {
  audioFileId: number;
  speakerId?: number;
  startTime: number;
  endTime: number;
  text: string;
}

// ============================================
// Speaker types
// ============================================
export interface Speaker {
  id: number;
  name: string;
  alias: string | null;
  gender: string | null;
  ageEstimate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateSpeakerInput {
  name: string;
  alias?: string;
  gender?: string;
  ageEstimate?: string;
  notes?: string;
}

export interface VoiceSample {
  id: number;
  speakerId: number;
  fileName: string;
  filePath: string;
  duration: number;
  createdAt: string;
}

// ============================================
// Vocabulary types
// ============================================
export interface AlertWord {
  id: number;
  keyword: string;
  category: string;
  description: string | null;
  createdAt: string;
}

export interface CreateAlertWordInput {
  keyword: string;
  category: string;
  description?: string;
}

export interface ReplacementWord {
  id: number;
  original: string;
  correct: string;
  category: string;
  createdAt: string;
}

export interface CreateReplacementWordInput {
  original: string;
  correct: string;
  category: string;
}

// ============================================
// User types
// ============================================
export type UserRole = 'admin' | 'investigator' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// ============================================
// Notification types
// ============================================
export type NotificationType = 'alert' | 'success' | 'crud' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  action: string;
  title: string;
  message: string | null;
  entityType: string | null;
  entityId: number | null;
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
}

// ============================================
// Activity log types
// ============================================
export type ActivityAction = 'login' | 'create' | 'edit' | 'delete' | 'export' | 'import';

export interface ActivityLog {
  id: number;
  userId: number | null;
  action: ActivityAction;
  targetType: string;
  targetId: number | null;
  details: string | null;
  createdAt: string;
}

// ============================================
// UI types
// ============================================
export type Page =
  | 'dashboard'
  | 'cases'
  | 'workspace'
  | 'users'
  | 'speakers'
  | 'alert-words'
  | 'replacements'
  | 'logs'
  | 'notifications'
  | 'support';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  type: ToastType;
  message: string;
}

// ============================================
// Settings types
// ============================================
export interface ImportantEvents {
  alert: boolean;
  success: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  import: boolean;
  login: boolean;
}
