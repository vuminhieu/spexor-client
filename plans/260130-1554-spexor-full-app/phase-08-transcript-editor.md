---
description: Transcript Editor with Speaker Assignment & AI Summary
status: pending
priority: P1
effort: 4h
---

# Phase 08: Transcript Editor & Speaker Panel

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 605-800
- Depends on: [Phase 07](phase-07-workspace-core.md)

## Overview

Transcript segments with speaker assignment, alert word highlighting, segment deletion, and AI summary panel.

## Related Files

```
src/components/features/
├── transcript/
│   ├── transcript-section.tsx   # Main transcript area
│   ├── transcript-segment.tsx   # Single segment
│   └── restore-bar.tsx          # Restore deleted
├── workspace/
│   ├── right-panel.tsx          # Speakers + Alerts + Summary
│   ├── speakers-panel.tsx       # Speaker assignment
│   ├── alerts-panel.tsx         # Alert word list
│   └── summary-panel.tsx        # AI summary
```

## Implementation Steps

### Step 1: Create Transcript Section
```tsx
// src/components/features/transcript/transcript-section.tsx
import { useState } from 'react';
import { TranscriptSegment } from './transcript-segment';
import { RestoreBar } from './restore-bar';

interface Segment {
  id: number;
  startTime: number;
  endTime: number;
  speakerId: string;
  text: string;
  isDeleted: boolean;
}

const mockSegments: Segment[] = [
  { id: 1, startTime: 0, endTime: 15, speakerId: 'A', text: 'Xin chào, tôi muốn hỏi về vụ việc <mark>chuyển khoản</mark> hôm qua.', isDeleted: false },
  { id: 2, startTime: 15, endTime: 35, speakerId: 'B', text: 'Vâng, tôi đã nhận được thông tin. Số <mark>tiền mặt</mark> là bao nhiêu?', isDeleted: false },
  { id: 3, startTime: 35, endTime: 55, speakerId: 'A', text: 'Khoảng năm trăm triệu. Chúng ta có thể gặp mặt để bàn chi tiết không?', isDeleted: false },
  { id: 4, startTime: 55, endTime: 80, speakerId: 'B', text: 'Được, chiều nay 3 giờ tại quán cà phê như đã hẹn nhé.', isDeleted: false },
];

export function TranscriptSection() {
  const [segments, setSegments] = useState(mockSegments);
  const [activeId, setActiveId] = useState<number | null>(3);

  const deletedCount = segments.filter(s => s.isDeleted).length;

  const deleteSegment = (id: number) => {
    setSegments(segments.map(s => 
      s.id === id ? { ...s, isDeleted: true } : s
    ));
  };

  const restoreAll = () => {
    setSegments(segments.map(s => ({ ...s, isDeleted: false })));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="transcript-section">
      <div className="transcript-header">
        <h3>Bản ghi âm</h3>
        <div className="transcript-actions">
          <div className="search-box small">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Tìm từ khóa..." />
          </div>
          <button className="btn btn-sm">📝 Tóm tắt AI</button>
        </div>
      </div>

      {deletedCount > 0 && (
        <RestoreBar count={deletedCount} onRestore={restoreAll} />
      )}

      <div className="transcript-content">
        {segments
          .filter(s => !s.isDeleted)
          .map(segment => (
            <TranscriptSegment
              key={segment.id}
              segment={{
                ...segment,
                time: formatTime(segment.startTime),
              }}
              isActive={segment.id === activeId}
              onClick={() => setActiveId(segment.id)}
              onDelete={() => deleteSegment(segment.id)}
            />
          ))}
      </div>
    </div>
  );
}
```

### Step 2: Create Transcript Segment
```tsx
// src/components/features/transcript/transcript-segment.tsx
interface SegmentProps {
  segment: {
    id: number;
    time: string;
    speakerId: string;
    text: string;
  };
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function TranscriptSegment({ segment, isActive, onClick, onDelete }: SegmentProps) {
  return (
    <div 
      className={`transcript-segment ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="segment-time">{segment.time}</div>
      <div className={`segment-speaker speaker-${segment.speakerId.toLowerCase()}`}>
        Speaker {segment.speakerId}
      </div>
      <div 
        className="segment-text"
        dangerouslySetInnerHTML={{ 
          __html: segment.text.replace(/<mark>/g, '<span class="highlight-alert">').replace(/<\/mark>/g, '</span>') 
        }}
      />
      <button 
        className="segment-delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Xóa đoạn này"
      >
        🗑️
      </button>
    </div>
  );
}
```

### Step 3: Create Restore Bar
```tsx
// src/components/features/transcript/restore-bar.tsx
interface RestoreBarProps {
  count: number;
  onRestore: () => void;
}

export function RestoreBar({ count, onRestore }: RestoreBarProps) {
  return (
    <div className="restore-bar">
      <span className="restore-info">
        <span>{count}</span> đoạn đã bị ẩn
      </span>
      <button className="btn btn-sm restore-btn" onClick={onRestore}>
        ↩️ Khôi phục tất cả
      </button>
    </div>
  );
}
```

### Step 4: Create Right Panel
```tsx
// src/components/features/workspace/right-panel.tsx
import { SpeakersPanel } from './speakers-panel';
import { AlertsPanel } from './alerts-panel';
import { SummaryPanel } from './summary-panel';

export function WorkspaceRightPanel() {
  return (
    <div className="workspace-right">
      <SpeakersPanel />
      <AlertsPanel />
      <SummaryPanel />
    </div>
  );
}
```

### Step 5: Create Speakers Panel
```tsx
// src/components/features/workspace/speakers-panel.tsx
import { useSpeakerStore } from '../../../stores';

interface TempSpeaker {
  id: string;
  label: string;
  duration: string;
}

const tempSpeakers: TempSpeaker[] = [
  { id: 'temp-a', label: 'A', duration: '2:45' },
  { id: 'temp-b', label: 'B', duration: '2:47' },
];

export function SpeakersPanel() {
  const { speakers } = useSpeakerStore();

  const handleAssign = (tempId: string, speakerId: string) => {
    console.log(`Assign ${tempId} to speaker ${speakerId}`);
  };

  return (
    <div className="speakers-panel">
      <div className="panel-header">
        <h3>Người nói</h3>
        <button className="btn btn-sm">+ Thêm</button>
      </div>
      <div className="speaker-list">
        {tempSpeakers.map(temp => (
          <div key={temp.id} className="speaker-item">
            <div className={`speaker-avatar speaker-${temp.label.toLowerCase()}`}>
              {temp.label}
            </div>
            <div className="speaker-info">
              <div className="speaker-select-wrapper">
                <select 
                  className="speaker-select"
                  onChange={(e) => handleAssign(temp.id, e.target.value)}
                >
                  <option value="">-- Chọn người nói --</option>
                  {speakers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                  <option value="new">➕ Thêm người nói mới...</option>
                </select>
              </div>
              <span className="speaker-duration">{temp.duration}</span>
            </div>
            <button className="btn-icon" title="Xóa">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 6: Create Alerts Panel
```tsx
// src/components/features/workspace/alerts-panel.tsx
interface Alert {
  word: string;
  time: string;
  seconds: number;
}

const alerts: Alert[] = [
  { word: 'chuyển khoản', time: '00:08', seconds: 8 },
  { word: 'tiền mặt', time: '00:22', seconds: 22 },
];

export function AlertsPanel() {
  const jumpToTime = (seconds: number) => {
    console.log(`Jump to ${seconds}s`);
  };

  return (
    <div className="alerts-panel-small">
      <div className="panel-header">
        <h3>Cảnh báo</h3>
        <span className="badge red">{alerts.length}</span>
      </div>
      <div className="alert-list-small">
        {alerts.map((alert, i) => (
          <div 
            key={i}
            className="alert-item-small"
            onClick={() => jumpToTime(alert.seconds)}
          >
            <span className="alert-word">{alert.word}</span>
            <span className="alert-time-small">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 7: Create Summary Panel
```tsx
// src/components/features/workspace/summary-panel.tsx
import { useState } from 'react';

type SummaryLevel = 'short' | 'medium' | 'detailed';

const summaries = {
  short: {
    topic: 'Giao dịch tài chính',
    content: 'Cuộc họp về chuyển khoản 500 triệu, hẹn gặp lúc 15:00.',
  },
  medium: {
    topic: 'Giao dịch tài chính',
    points: [
      'Thảo luận về giao dịch chuyển khoản',
      'Số tiền: 500 triệu đồng',
      'Hẹn gặp mặt lúc 15:00',
    ],
  },
  detailed: {
    topic: 'Giao dịch tài chính - Chuyển khoản liên ngân hàng',
    points: [
      { label: 'Bối cảnh', value: 'Cuộc gọi giữa 2 đối tượng bàn về giao dịch tài chính' },
      { label: 'Nội dung giao dịch', value: 'Thảo luận về việc chuyển khoản số tiền lớn' },
      { label: 'Số tiền', value: '500 triệu đồng (năm trăm triệu đồng)' },
      { label: 'Phương thức', value: 'Chuyển khoản ngân hàng' },
      { label: 'Lịch hẹn', value: 'Gặp mặt trực tiếp lúc 15:00' },
      { label: 'Cảnh báo', value: 'Phát hiện 2 từ khóa nhạy cảm' },
    ],
    participants: ['Speaker A (Đối tượng A)', 'Speaker B (Đối tượng B)'],
  },
};

export function SummaryPanel() {
  const [level, setLevel] = useState<SummaryLevel>('medium');

  const copyToClipboard = () => {
    // TODO: Implement copy
    console.log('Copied summary');
  };

  return (
    <div className="summary-panel enhanced">
      <div className="panel-header">
        <h3>🤖 Tóm tắt AI</h3>
        <button className="btn-icon" onClick={copyToClipboard} title="Sao chép">
          📋
        </button>
      </div>

      <div className="summary-level-selector">
        <label>Mức độ:</label>
        <div className="level-buttons">
          {(['short', 'medium', 'detailed'] as const).map(l => (
            <button
              key={l}
              className={`level-btn ${level === l ? 'active' : ''}`}
              onClick={() => setLevel(l)}
            >
              {l === 'short' ? 'Ngắn' : l === 'medium' ? 'Trung bình' : 'Chi tiết'}
            </button>
          ))}
        </div>
      </div>

      <div className="summary-content-card">
        <div className="summary-topic">
          <span className="topic-label">Chủ đề:</span>
          <span className="topic-value">{summaries[level].topic}</span>
        </div>
        
        {level === 'short' && (
          <div className="summary-main">
            <span className="main-label">Tóm tắt:</span>
            <p className="summary-brief">{summaries.short.content}</p>
          </div>
        )}

        {level === 'medium' && (
          <div className="summary-main">
            <span className="main-label">Ý chính:</span>
            <ul className="summary-points">
              {summaries.medium.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}

        {level === 'detailed' && (
          <>
            <div className="summary-main">
              <span className="main-label">Nội dung chi tiết:</span>
              <ul className="summary-points">
                {summaries.detailed.points.map((p, i) => (
                  <li key={i}><strong>{p.label}:</strong> {p.value}</li>
                ))}
              </ul>
            </div>
            <div className="summary-participants">
              <span className="main-label">Người tham gia:</span>
              <div className="participant-tags">
                {summaries.detailed.participants.map((p, i) => (
                  <span key={i} className="participant-tag">{p}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

## Todo

- [ ] Create transcript/ folder
- [ ] Create transcript-section.tsx
- [ ] Create transcript-segment.tsx
- [ ] Create restore-bar.tsx
- [ ] Create workspace/ folder
- [ ] Create right-panel.tsx
- [ ] Create speakers-panel.tsx
- [ ] Create alerts-panel.tsx
- [ ] Create summary-panel.tsx
- [ ] Add transcript CSS styles
- [ ] Integrate with audio player for time sync

## Success Criteria

1. ✅ Transcript segments render
2. ✅ Alert words highlighted
3. ✅ Delete/restore segments work
4. ✅ Speaker assignment dropdown
5. ✅ Alerts list clickable
6. ✅ Summary with 3 levels

## Next Steps

After completing this phase:
1. Proceed to [Phase 09: Speaker Management](phase-09-speaker-management.md)
