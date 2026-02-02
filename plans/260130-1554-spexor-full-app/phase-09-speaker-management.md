---
description: Speaker Management Page with Voice Samples
status: pending
priority: P2
effort: 3h
---

# Phase 09: Speaker Management

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 851-891

## Overview

Speaker list page with add/edit modal and voice sample upload for speaker recognition.

## Related Files

```
src/
├── components/
│   └── features/
│       └── speakers/
│           ├── speaker-grid.tsx    # Grid layout
│           ├── speaker-card.tsx    # Speaker card
│           ├── speaker-modal.tsx   # Add/Edit modal
│           └── voice-samples.tsx   # Voice sample upload
└── pages/
    └── speakers.tsx
```

## Implementation Steps

### Step 1: Create Speakers Page
```tsx
// src/pages/speakers.tsx
import { useEffect } from 'react';
import { useSpeakerStore, useUIStore } from '../stores';
import { SpeakerGrid } from '../components/features/speakers/speaker-grid';
import { SpeakerModal } from '../components/features/speakers/speaker-modal';

export function SpeakersPage() {
  const { speakers, fetchSpeakers, loading } = useSpeakerStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    fetchSpeakers();
  }, []);

  return (
    <div id="page-speakers" className="page active">
      <div className="page-header">
        <h1>Quản lý người nói</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => openModal('speaker-modal')}
          >
            + Thêm người nói
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <SpeakerGrid speakers={speakers} />
      )}

      <SpeakerModal />
    </div>
  );
}
```

### Step 2: Create Speaker Grid
```tsx
// src/components/features/speakers/speaker-grid.tsx
import { SpeakerCard } from './speaker-card';
import type { Speaker } from '../../../types';

interface SpeakerGridProps {
  speakers: Speaker[];
}

export function SpeakerGrid({ speakers }: SpeakerGridProps) {
  if (speakers.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có người nói nào. Nhấn "Thêm người nói" để tạo mới.</p>
      </div>
    );
  }

  return (
    <div className="speakers-grid">
      {speakers.map(speaker => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  );
}
```

### Step 3: Create Speaker Card
```tsx
// src/components/features/speakers/speaker-card.tsx
import { useSpeakerStore, useUIStore } from '../../../stores';
import type { Speaker } from '../../../types';

interface SpeakerCardProps {
  speaker: Speaker;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const { setCurrentSpeaker } = useSpeakerStore();
  const { openModal } = useUIStore();

  const handleEdit = () => {
    setCurrentSpeaker(speaker);
    openModal('speaker-modal');
  };

  return (
    <div className="speaker-card">
      <div className="speaker-photo">👤</div>
      <div className="speaker-details">
        <h4>{speaker.name}</h4>
        {speaker.alias && (
          <span className="speaker-alias">Biệt danh: "{speaker.alias}"</span>
        )}
        <div className="speaker-stats">
          <span>📁 0 sự vụ</span>
          <span>🕐 0h 0m</span>
        </div>
      </div>
      <div className="speaker-actions">
        <button className="btn btn-sm">🎤 Voice Profile</button>
        <button className="btn-icon" onClick={handleEdit}>✏️</button>
      </div>
    </div>
  );
}
```

### Step 4: Create Speaker Modal
```tsx
// src/components/features/speakers/speaker-modal.tsx
import { useState, useEffect } from 'react';
import { useSpeakerStore, useUIStore } from '../../../stores';
import { VoiceSamples } from './voice-samples';

export function SpeakerModal() {
  const { activeModal, closeModal, showToast } = useUIStore();
  const { currentSpeaker, createSpeaker, updateSpeaker, setCurrentSpeaker } = useSpeakerStore();

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    gender: '',
    ageEstimate: '',
    notes: '',
  });
  const [voiceSamples, setVoiceSamples] = useState<File[]>([]);

  useEffect(() => {
    if (currentSpeaker) {
      setFormData({
        name: currentSpeaker.name,
        alias: currentSpeaker.alias || '',
        gender: currentSpeaker.gender || '',
        ageEstimate: currentSpeaker.ageEstimate || '',
        notes: currentSpeaker.notes || '',
      });
    } else {
      setFormData({ name: '', alias: '', gender: '', ageEstimate: '', notes: '' });
    }
  }, [currentSpeaker]);

  if (activeModal !== 'speaker-modal') return null;

  const handleClose = () => {
    closeModal();
    setCurrentSpeaker(null);
    setFormData({ name: '', alias: '', gender: '', ageEstimate: '', notes: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentSpeaker) {
        await updateSpeaker(currentSpeaker.id, formData);
        showToast('success', 'Đã cập nhật người nói');
      } else {
        await createSpeaker(formData);
        showToast('success', 'Đã thêm người nói');
      }
      handleClose();
    } catch (error) {
      showToast('error', 'Không thể lưu người nói');
    }
  };

  const isEdit = !!currentSpeaker;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Sửa người nói' : 'Thêm người nói mới'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Thông tin cơ bản */}
            <section className="form-section">
              <h3>👤 Thông tin cơ bản</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên người nói *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                    placeholder="Nhập tên"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Biệt danh</label>
                  <input
                    type="text"
                    value={formData.alias}
                    onChange={(e) => setFormData(d => ({ ...d, alias: e.target.value }))}
                    placeholder="Nhập biệt danh"
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(d => ({ ...d, gender: e.target.value }))}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="unknown">Không xác định</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Độ tuổi ước tính</label>
                  <input
                    type="text"
                    value={formData.ageEstimate}
                    onChange={(e) => setFormData(d => ({ ...d, ageEstimate: e.target.value }))}
                    placeholder="VD: 30-40"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mô tả/Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(d => ({ ...d, notes: e.target.value }))}
                    placeholder="Ghi chú thêm..."
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Voice Samples */}
            <section className="form-section">
              <h3>🎤 Voice Sample (để nhận dạng tự động)</h3>
              <VoiceSamples
                samples={voiceSamples}
                onSamplesChange={setVoiceSamples}
              />
            </section>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              💾 {isEdit ? 'Cập nhật' : 'Lưu người nói'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Step 5: Create Voice Samples Component
```tsx
// src/components/features/speakers/voice-samples.tsx
import { useRef, useState } from 'react';

interface VoiceSamplesProps {
  samples: File[];
  onSamplesChange: (samples: File[]) => void;
}

interface SampleWithAudio {
  file: File;
  audio?: HTMLAudioElement;
  playing: boolean;
  duration: number;
}

export function VoiceSamples({ samples, onSamplesChange }: VoiceSamplesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sampleStates, setSampleStates] = useState<SampleWithAudio[]>([]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onSamplesChange([...samples, ...files]);
    
    // Create audio objects
    files.forEach(file => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setSampleStates(prev => [...prev, {
          file,
          audio,
          playing: false,
          duration: audio.duration,
        }]);
      };
    });
  };

  const togglePlay = (index: number) => {
    setSampleStates(prev => prev.map((s, i) => {
      if (i === index) {
        if (s.playing) {
          s.audio?.pause();
        } else {
          s.audio?.play();
        }
        return { ...s, playing: !s.playing };
      }
      return s;
    }));
  };

  const removeSample = (index: number) => {
    onSamplesChange(samples.filter((_, i) => i !== index));
    setSampleStates(prev => prev.filter((_, i) => i !== index));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="voice-samples">
      <div 
        className="upload-zone small"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,.m4a,.flac"
          multiple
          hidden
          onChange={handleSelect}
        />
        <span>📁 Click để chọn file mẫu giọng nói</span>
        <small>Hỗ trợ: .wav, .mp3, .m4a, .flac</small>
      </div>

      {sampleStates.length > 0 && (
        <div className="voice-samples-list">
          {sampleStates.map((sample, index) => (
            <div key={index} className="voice-sample-item">
              <span className="sample-icon">🎵</span>
              <div className="sample-info">
                <span className="sample-name">{sample.file.name}</span>
                <span className="sample-meta">
                  {formatSize(sample.file.size)} • {formatDuration(sample.duration)}
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => togglePlay(index)}
              >
                {sample.playing ? '⏸️' : '▶️'}
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeSample(index)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Todo

- [ ] Create speakers/ folder
- [ ] Create speaker-grid.tsx
- [ ] Create speaker-card.tsx
- [ ] Create speaker-modal.tsx
- [ ] Create voice-samples.tsx
- [ ] Create speakers.tsx page
- [ ] Add speaker CSS styles
- [ ] Test CRUD operations

## Success Criteria

1. ✅ Speaker grid loads from backend
2. ✅ Add modal opens and creates speaker
3. ✅ Edit modal pre-fills data
4. ✅ Voice sample upload works
5. ✅ Voice sample playback works

## Next Steps

After completing this phase:
1. Proceed to [Phase 10: Vocabulary](phase-10-vocabulary.md)
