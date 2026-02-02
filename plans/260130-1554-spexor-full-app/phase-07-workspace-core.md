---
description: Audio Workspace with Player, File List, Waveform
status: pending
priority: P1
effort: 4h
---

# Phase 07: Workspace Core (Audio Player)

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 475-800
- Depends on: [Phase 06](phase-06-case-management.md) for navigation

## Overview

Audio workspace with file list, waveform audio player, and playback controls.

## Related Files

```
src/
├── components/
│   └── features/
│       └── audio/
│           ├── audio-files-panel.tsx   # File list sidebar
│           ├── audio-player.tsx        # Waveform + controls
│           └── waveform.tsx            # Waveform visualization
└── pages/
    └── workspace.tsx
```

## Implementation Steps

### Step 1: Create Workspace Page
```tsx
// src/pages/workspace.tsx
import { useCaseStore, useUIStore } from '../stores';
import { AudioFilesPanel } from '../components/features/audio/audio-files-panel';
import { AudioPlayer } from '../components/features/audio/audio-player';
import { TranscriptSection } from '../components/features/transcript/transcript-section';
import { WorkspaceRightPanel } from '../components/features/workspace/right-panel';

export function WorkspacePage() {
  const { currentCase, audioFiles } = useCaseStore();
  const { setPage, showToast } = useUIStore();

  if (!currentCase) {
    return (
      <div className="page">
        <p>Không có sự vụ được chọn. <a onClick={() => setPage('cases')}>Quay lại</a></p>
      </div>
    );
  }

  const handleSave = () => {
    showToast('success', 'Đã lưu thay đổi');
  };

  return (
    <div id="page-workspace" className="page active">
      {/* Header */}
      <div className="page-header workspace-header">
        <div className="workspace-header-left">
          <div className="workspace-breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('cases'); }}>
              Sự vụ
            </a>
            {' / '}
            <span>{currentCase.code}</span>
          </div>
          <div className="case-info-panel">
            <div className="case-info-row">
              <label>Tiêu đề:</label>
              <input 
                type="text"
                className="case-title-input"
                defaultValue={currentCase.title}
                placeholder="Nhập tiêu đề sự vụ"
              />
            </div>
            <div className="case-info-row">
              <label>Mô tả:</label>
              <input 
                type="text"
                className="case-desc-input"
                defaultValue={currentCase.description || ''}
                placeholder="Mô tả chi tiết..."
              />
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">📤 Export Word</button>
          <button className="btn btn-secondary">📤 Export PDF</button>
          <button className="btn btn-primary" onClick={handleSave}>💾 Lưu</button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="workspace-container">
        <AudioFilesPanel files={audioFiles} />
        
        <div className="workspace-main">
          <AudioPlayer />
          <TranscriptSection />
        </div>

        <WorkspaceRightPanel />
      </div>
    </div>
  );
}
```

### Step 2: Create Audio Files Panel
```tsx
// src/components/features/audio/audio-files-panel.tsx
import { useState } from 'react';
import { useUIStore } from '../../../stores';
import type { AudioFile } from '../../../types';

interface AudioFilesPanelProps {
  files: AudioFile[];
}

export function AudioFilesPanel({ files }: AudioFilesPanelProps) {
  const { openModal, showToast } = useUIStore();
  const [selectedFileId, setSelectedFileId] = useState<number | null>(
    files[0]?.id || null
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <span className="audio-status completed">✓</span>;
      case 'processing': return <span className="audio-status processing">⏳</span>;
      default: return <span className="audio-status pending">○</span>;
    }
  };

  const handleReanalyze = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('info', 'Đang phân tích lại...');
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Xóa file audio này?')) {
      showToast('success', 'Đã xóa file audio');
    }
  };

  return (
    <div className="audio-files-panel">
      <div className="panel-header">
        <h3>File Audio</h3>
        <button className="btn btn-sm" onClick={() => openModal('upload-modal')}>
          + Upload
        </button>
      </div>
      
      <div className="audio-list">
        {files.map((file) => (
          <div 
            key={file.id}
            className={`audio-item ${selectedFileId === file.id ? 'active' : ''}`}
            onClick={() => setSelectedFileId(file.id)}
          >
            <span className="audio-icon">🎵</span>
            <div className="audio-info">
              <span className="audio-name">{file.fileName}</span>
              <span className="audio-duration">
                {Math.floor(file.duration / 60)}:{String(Math.floor(file.duration % 60)).padStart(2, '0')}
              </span>
              {file.status === 'processing' && (
                <div className="audio-progress">
                  <div className="audio-progress-bar" style={{ width: '65%' }} />
                  <span className="audio-progress-text">65%</span>
                </div>
              )}
            </div>
            {getStatusIcon(file.status)}
            <button 
              className="audio-action-btn"
              onClick={(e) => handleReanalyze(file.id, e)}
              title="Phân tích lại"
            >
              🔄
            </button>
            <button 
              className="audio-delete-btn"
              onClick={(e) => handleDelete(file.id, e)}
              title="Xóa file"
            >
              🗑️
            </button>
          </div>
        ))}

        {files.length === 0 && (
          <div className="empty-state">
            <p>Chưa có file audio</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 3: Create Audio Player
```tsx
// src/components/features/audio/audio-player.tsx
import { useState, useRef } from 'react';
import { Waveform } from './waveform';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(332); // 5:32
  const [speed, setSpeed] = useState(1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, currentTime + seconds)));
  };

  const seekTo = (percentage: number) => {
    setCurrentTime(duration * percentage);
  };

  return (
    <div className="audio-player-section">
      {/* Waveform */}
      <Waveform 
        progress={currentTime / duration}
        onSeek={seekTo}
      />

      {/* Controls */}
      <div className="player-controls">
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="separator">/</span>
          <span className="total-time">{formatTime(duration)}</span>
        </div>

        <div className="control-buttons">
          <button className="control-btn" onClick={() => setCurrentTime(0)}>⏮️</button>
          <button className="control-btn" onClick={() => skip(-10)}>⏪</button>
          <button className="control-btn play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="control-btn" onClick={() => skip(10)}>⏩</button>
          <button className="control-btn" onClick={() => setCurrentTime(duration)}>⏭️</button>
        </div>

        <div className="speed-control">
          <label>Tốc độ:</label>
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create Waveform Component
```tsx
// src/components/features/audio/waveform.tsx
interface WaveformProps {
  progress: number; // 0-1
  onSeek: (percentage: number) => void;
}

// Generate random bars for visualization
const bars = Array.from({ length: 50 }, () => Math.random() * 60 + 20);

export function Waveform({ progress, onSeek }: WaveformProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, percentage)));
  };

  return (
    <div className="waveform" onClick={handleClick}>
      <div className="waveform-visual">
        {bars.map((height, i) => (
          <div 
            key={i}
            className="wave-bar"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div 
        className="waveform-progress" 
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
```

### Step 5: Add Workspace CSS
```css
/* Workspace Layout */
.workspace-container {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 1rem;
  height: calc(100vh - 140px);
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.workspace-breadcrumb {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.case-info-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.case-info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.case-title-input,
.case-desc-input {
  flex: 1;
  background: transparent;
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: var(--text-primary);
}

.case-title-input:focus,
.case-desc-input:focus {
  border-color: var(--primary);
  outline: none;
}

/* Audio Files Panel */
.audio-files-panel {
  background: var(--bg-card);
  border-radius: 8px;
  overflow: hidden;
}

.audio-list {
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}

.audio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background 0.2s;
}

.audio-item:hover {
  background: var(--bg-hover);
}

.audio-item.active {
  background: var(--bg-active);
  border-left: 3px solid var(--primary);
}

/* Waveform */
.waveform {
  height: 80px;
  background: var(--bg-card);
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.waveform-visual {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding: 0 1rem;
}

.wave-bar {
  width: 4px;
  background: var(--text-tertiary);
  border-radius: 2px;
}

.waveform-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(59, 130, 246, 0.3);
  pointer-events: none;
}

/* Player Controls */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: 8px;
  margin-top: 0.5rem;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.control-btn:hover {
  background: var(--bg-hover);
}

.play-btn {
  font-size: 1.5rem;
}
```

## Todo

- [ ] Create audio/ folder
- [ ] Create audio-files-panel.tsx
- [ ] Create audio-player.tsx
- [ ] Create waveform.tsx
- [ ] Create workspace.tsx page
- [ ] Add workspace CSS styles
- [ ] Integrate with real audio playback

## Success Criteria

1. ✅ Workspace loads with current case
2. ✅ Audio files list shows
3. ✅ Waveform renders
4. ✅ Play/pause controls work
5. ✅ Seek by clicking waveform
6. ✅ Speed control changes

## Next Steps

After completing this phase:
1. Proceed to [Phase 08: Transcript Editor](phase-08-transcript-editor.md)
