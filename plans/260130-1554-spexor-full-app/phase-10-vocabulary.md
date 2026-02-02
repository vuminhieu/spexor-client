---
description: Alert Words & Replacement Words Pages
status: pending
priority: P2
effort: 3h
---

# Phase 10: Vocabulary Management

## Context

- Parent Plan: [plan.md](plan.md)
- UI Reference: [folder_app_template/index.html](../../folder_app_template/index.html) lines 893-1006

## Overview

Alert words and replacement words management pages with category tabs and CRUD modals.

## Related Files

```
src/
├── components/
│   └── features/
│       └── vocabulary/
│           ├── alert-word-table.tsx
│           ├── alert-word-modal.tsx
│           ├── replacement-table.tsx
│           ├── replacement-modal.tsx
│           └── category-tabs.tsx
└── pages/
    ├── alert-words.tsx
    └── replacements.tsx
```

## Implementation Steps

### Step 1: Create Alert Words Page
```tsx
// src/pages/alert-words.tsx
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../stores';
import { CategoryTabs } from '../components/features/vocabulary/category-tabs';
import { AlertWordTable } from '../components/features/vocabulary/alert-word-table';
import { AlertWordModal } from '../components/features/vocabulary/alert-word-modal';
import type { AlertWord } from '../types';

const categories = ['Tất cả', 'Tài chính', 'Bạo lực', 'Ma túy', 'Khác'];

export function AlertWordsPage() {
  const { openModal } = useUIStore();
  const [words, setWords] = useState<AlertWord[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const data = await invoke<AlertWord[]>('get_alert_words');
      setWords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = activeCategory === 'Tất cả' 
    ? words 
    : words.filter(w => w.category === activeCategory);

  return (
    <div id="page-alert-words" className="page active">
      <div className="page-header">
        <h1>Từ ngữ cảnh báo</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">📥 Import</button>
          <button className="btn btn-secondary">📤 Export</button>
          <button 
            className="btn btn-primary"
            onClick={() => openModal('alert-word-modal')}
          >
            + Thêm từ khóa
          </button>
        </div>
      </div>

      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <AlertWordTable words={filteredWords} onRefresh={loadWords} />
      )}

      <AlertWordModal onSuccess={loadWords} />
    </div>
  );
}
```

### Step 2: Create Category Tabs
```tsx
// src/components/features/vocabulary/category-tabs.tsx
interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="category-tabs">
      {categories.map(category => (
        <button
          key={category}
          className={`tab ${active === category ? 'active' : ''}`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
```

### Step 3: Create Alert Word Table
```tsx
// src/components/features/vocabulary/alert-word-table.tsx
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../../../stores';
import type { AlertWord } from '../../../types';

interface AlertWordTableProps {
  words: AlertWord[];
  onRefresh: () => void;
}

export function AlertWordTable({ words, onRefresh }: AlertWordTableProps) {
  const { showToast } = useUIStore();

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa từ khóa này?')) return;
    
    try {
      await invoke('delete_alert_word', { id });
      showToast('success', 'Đã xóa từ khóa');
      onRefresh();
    } catch (error) {
      showToast('error', 'Không thể xóa từ khóa');
    }
  };

  if (words.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có từ khóa nào trong danh mục này.</p>
      </div>
    );
  }

  return (
    <div className="keywords-table">
      <table>
        <thead>
          <tr>
            <th>Từ khóa</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td><span className="keyword">{word.keyword}</span></td>
              <td>{word.category}</td>
              <td className="description-cell">{word.description || '-'}</td>
              <td>
                <button className="btn-icon">✏️</button>
                <button 
                  className="btn-icon"
                  onClick={() => handleDelete(word.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Step 4: Create Alert Word Modal
```tsx
// src/components/features/vocabulary/alert-word-modal.tsx
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../../../stores';

interface AlertWordModalProps {
  onSuccess: () => void;
}

const categories = ['Tài chính', 'Bạo lực', 'Ma túy', 'Khác'];

export function AlertWordModal({ onSuccess }: AlertWordModalProps) {
  const { activeModal, closeModal, showToast } = useUIStore();
  const [formData, setFormData] = useState({
    keyword: '',
    category: 'Khác',
    description: '',
  });

  if (activeModal !== 'alert-word-modal') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke('create_alert_word', { input: formData });
      showToast('success', 'Đã thêm từ khóa');
      closeModal();
      setFormData({ keyword: '', category: 'Khác', description: '' });
      onSuccess();
    } catch (error) {
      showToast('error', 'Không thể thêm từ khóa');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm từ khóa cảnh báo</h2>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Từ khóa *</label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData(d => ({ ...d, keyword: e.target.value }))}
                placeholder="Nhập từ khóa"
                required
              />
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(d => ({ ...d, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                placeholder="Mô tả từ khóa..."
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Step 5: Create Replacements Page
```tsx
// src/pages/replacements.tsx
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../stores';
import { ReplacementTable } from '../components/features/vocabulary/replacement-table';
import type { ReplacementWord } from '../types';

export function ReplacementsPage() {
  const { openModal } = useUIStore();
  const [words, setWords] = useState<ReplacementWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const data = await invoke<ReplacementWord[]>('get_replacement_words');
      setWords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="page-replacements" className="page active">
      <div className="page-header">
        <h1>Từ ngữ thay thế</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">📥 Import</button>
          <button 
            className="btn btn-primary"
            onClick={() => openModal('replacement-modal')}
          >
            + Thêm từ thay thế
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <ReplacementTable words={words} onRefresh={loadWords} />
      )}
    </div>
  );
}
```

### Step 6: Create Replacement Table
```tsx
// src/components/features/vocabulary/replacement-table.tsx
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../../../stores';
import type { ReplacementWord } from '../../../types';

interface ReplacementTableProps {
  words: ReplacementWord[];
  onRefresh: () => void;
}

export function ReplacementTable({ words, onRefresh }: ReplacementTableProps) {
  const { showToast } = useUIStore();

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa từ thay thế này?')) return;
    
    try {
      await invoke('delete_replacement_word', { id });
      showToast('success', 'Đã xóa');
      onRefresh();
    } catch (error) {
      showToast('error', 'Không thể xóa');
    }
  };

  if (words.length === 0) {
    return (
      <div className="empty-state">
        <p>Chưa có từ thay thế nào.</p>
      </div>
    );
  }

  return (
    <div className="replacements-table">
      <table>
        <thead>
          <tr>
            <th>Từ gốc (AI nhận dạng)</th>
            <th>→</th>
            <th>Từ đúng</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td><span className="word-original">{word.original}</span></td>
              <td>→</td>
              <td><span className="word-correct">{word.correct}</span></td>
              <td>{word.category}</td>
              <td>
                <button className="btn-icon">✏️</button>
                <button 
                  className="btn-icon"
                  onClick={() => handleDelete(word.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Todo

- [ ] Create vocabulary/ folder
- [ ] Create category-tabs.tsx
- [ ] Create alert-word-table.tsx
- [ ] Create alert-word-modal.tsx
- [ ] Create replacement-table.tsx
- [ ] Create replacement-modal.tsx
- [ ] Create alert-words.tsx page
- [ ] Create replacements.tsx page
- [ ] Add vocabulary CSS styles

## Success Criteria

1. ✅ Alert words load with category tabs
2. ✅ Filter by category works
3. ✅ Add alert word modal works
4. ✅ Replacement words table loads
5. ✅ Delete operations work

## Next Steps

After completing this phase:
1. Proceed to [Phase 11: Notifications](phase-11-notifications.md)
