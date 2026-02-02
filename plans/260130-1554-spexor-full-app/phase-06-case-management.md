---
description: Case Management List Page & CRUD Modals
status: pending
priority: P1
effort: 4h
---

# Phase 06: Case Management

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 407-472
- Depends on: [Phase 03](phase-03-rust-commands.md) for backend

## Overview

Case list page với search, add modal, và navigation to workspace.

## Related Files

```
src/
├── components/
│   └── features/
│       └── cases/
│           ├── case-table.tsx      # Cases data table
│           ├── case-modal.tsx      # Add/Edit modal
│           ├── audio-upload.tsx    # Upload zone
│           └── case-settings.tsx   # Analysis settings
└── pages/
    └── cases.tsx
```

## Implementation Steps

### Step 1: Create Cases Page
```tsx
// src/pages/cases.tsx
import { useEffect } from 'react';
import { useCaseStore, useUIStore } from '../stores';
import { CaseTable } from '../components/features/cases/case-table';
import { CaseModal } from '../components/features/cases/case-modal';

export function CasesPage() {
  const { cases, fetchCases, loading } = useCaseStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div id="page-cases" className="page active">
      <div className="page-header">
        <h1>Quản lý sự vụ</h1>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Tìm kiếm sự vụ..." />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => openModal('case-modal')}
          >
            + Thêm sự vụ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <CaseTable cases={cases} />
      )}

      <CaseModal />
    </div>
  );
}
```

### Step 2: Create Case Table
```tsx
// src/components/features/cases/case-table.tsx
import { useCaseStore, useUIStore } from '../../../stores';
import type { Case } from '../../../types';

interface CaseTableProps {
  cases: Case[];
}

export function CaseTable({ cases }: CaseTableProps) {
  const { setCurrentCase, deleteCase } = useCaseStore();
  const { setPage, showToast } = useUIStore();

  const handleOpenWorkspace = (caseItem: Case) => {
    setCurrentCase(caseItem);
    setPage('workspace');
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa sự vụ này?')) {
      try {
        await deleteCase(id);
        showToast('success', 'Đã xóa sự vụ');
      } catch (error) {
        showToast('error', 'Không thể xóa sự vụ');
      }
    }
  };

  return (
    <div className="cases-table">
      <table>
        <thead>
          <tr>
            <th>Mã sự vụ</th>
            <th>Tiêu đề</th>
            <th>Số file</th>
            <th>Cảnh báo</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr 
              key={caseItem.id}
              onClick={() => handleOpenWorkspace(caseItem)}
              className="clickable"
            >
              <td>
                <span className="case-id">{caseItem.code}</span>
              </td>
              <td>{caseItem.title}</td>
              <td>0</td>
              <td><span className="alert-count">0</span></td>
              <td>{new Date(caseItem.createdAt).toLocaleDateString('vi-VN')}</td>
              <td className="actions">
                <button 
                  className="btn-icon" 
                  title="Xem"
                  onClick={(e) => { e.stopPropagation(); handleOpenWorkspace(caseItem); }}
                >
                  👁️
                </button>
                <button 
                  className="btn-icon" 
                  title="Sửa"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✏️
                </button>
                <button 
                  className="btn-icon" 
                  title="Xóa"
                  onClick={(e) => handleDelete(caseItem.id, e)}
                >
                  🗑️
                </button>
                <button 
                  className="btn-icon" 
                  title="Xuất"
                  onClick={(e) => e.stopPropagation()}
                >
                  📤
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {cases.length === 0 && (
        <div className="empty-state">
          <p>Chưa có sự vụ nào. Nhấn "Thêm sự vụ" để tạo mới.</p>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Create Case Modal
```tsx
// src/components/features/cases/case-modal.tsx
import { useState } from 'react';
import { useCaseStore, useUIStore } from '../../../stores';
import { AudioUpload } from './audio-upload';
import { CaseSettings } from './case-settings';

export function CaseModal() {
  const { activeModal, closeModal, showToast } = useUIStore();
  const { createCase } = useCaseStore();
  
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    assignees: [] as string[],
  });
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [settings, setSettings] = useState({
    detectKeywords: true,
    speakerDiarization: true,
    aiSummary: true,
  });

  if (activeModal !== 'case-modal') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCase({
        code: formData.code,
        title: formData.title,
        description: formData.description || undefined,
      });
      showToast('success', 'Đã tạo sự vụ mới');
      closeModal();
      setFormData({ code: '', title: '', description: '', assignees: [] });
    } catch (error) {
      showToast('error', 'Không thể tạo sự vụ');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm sự vụ mới</h2>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Thông tin sự vụ */}
            <section className="form-section">
              <h3>📋 Thông tin sự vụ</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã sự vụ *</label>
                  <input 
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(d => ({ ...d, code: e.target.value }))}
                    placeholder="VV-2026-XXX"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(d => ({ ...d, title: e.target.value }))}
                    placeholder="Nhập tiêu đề sự vụ"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mô tả</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                    placeholder="Mô tả chi tiết..."
                    rows={3}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Người được gán</label>
                  <select multiple>
                    <option>Admin</option>
                    <option>Trần Văn Điều Tra</option>
                    <option>Lê Thị Xem</option>
                  </select>
                </div>
              </div>
            </section>

            {/* File Audio */}
            <section className="form-section">
              <h3>🎵 File Audio</h3>
              <AudioUpload 
                files={audioFiles}
                onFilesChange={setAudioFiles}
              />
            </section>

            {/* Cấu hình phân tích */}
            <section className="form-section">
              <h3>⚙️ Cấu hình phân tích</h3>
              <CaseSettings 
                settings={settings}
                onSettingsChange={setSettings}
              />
            </section>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Lưu sự vụ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Step 4: Create Audio Upload
```tsx
// src/components/features/cases/audio-upload.tsx
import { useRef } from 'react';

interface AudioUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function AudioUpload({ files, onFilesChange }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('audio/')
    );
    onFilesChange([...files, ...droppedFiles]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="audio-upload">
      <div 
        className="upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={handleSelect}
        />
        <span className="upload-icon">📁</span>
        <p>Kéo thả file audio vào đây hoặc click để chọn</p>
        <small>Hỗ trợ: .wav, .mp3, .m4a, .flac</small>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="uploaded-file">
              <span className="file-icon">🎵</span>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatSize(file.size)}</span>
              </div>
              <button 
                type="button"
                className="btn-icon"
                onClick={() => removeFile(index)}
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

### Step 5: Create Case Settings
```tsx
// src/components/features/cases/case-settings.tsx
interface CaseSettingsProps {
  settings: {
    detectKeywords: boolean;
    speakerDiarization: boolean;
    aiSummary: boolean;
  };
  onSettingsChange: (settings: CaseSettingsProps['settings']) => void;
}

export function CaseSettings({ settings, onSettingsChange }: CaseSettingsProps) {
  const toggle = (key: keyof typeof settings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="case-settings">
      <label className="checkbox-label">
        <input 
          type="checkbox"
          checked={settings.detectKeywords}
          onChange={() => toggle('detectKeywords')}
        />
        <span>✅ Phát hiện từ khóa cảnh báo</span>
      </label>
      
      <label className="checkbox-label">
        <input 
          type="checkbox"
          checked={settings.speakerDiarization}
          onChange={() => toggle('speakerDiarization')}
        />
        <span>✅ Phân biệt người nói (Speaker Diarization)</span>
      </label>
      
      <label className="checkbox-label">
        <input 
          type="checkbox"
          checked={settings.aiSummary}
          onChange={() => toggle('aiSummary')}
        />
        <span>✅ Tóm tắt AI tự động</span>
      </label>
    </div>
  );
}
```

## Todo

- [ ] Create cases/ folder
- [ ] Create case-table.tsx
- [ ] Create case-modal.tsx
- [ ] Create audio-upload.tsx
- [ ] Create case-settings.tsx
- [ ] Create cases.tsx page
- [ ] Add modal CSS styles
- [ ] Test CRUD operations

## Success Criteria

1. ✅ Cases list loads from backend
2. ✅ Search filter works
3. ✅ Add modal opens and creates case
4. ✅ Audio upload zone works
5. ✅ Delete confirms and removes
6. ✅ Click row opens workspace

## Next Steps

After completing this phase:
1. Proceed to [Phase 07: Workspace Core](phase-07-workspace-core.md)
