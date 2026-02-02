import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../stores';
import { CategoryTabs } from '../components/features/vocabulary/category-tabs';
import { AlertWordTable } from '../components/features/vocabulary/alert-word-table';
import { AlertWordModal } from '../components/features/vocabulary/alert-word-modal';
import type { AlertWord } from '../types';

const categories = ['Tất cả', 'Tài chính', 'Bạo lực', 'Ma túy', 'Khác'];

export function AlertWordsPage() {
  const { openModal, showToast } = useUIStore();
  const [words, setWords] = useState<AlertWord[]>([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    try {
      const data = await invoke<AlertWord[]>('get_alert_words');
      setWords(data);
    } catch (error) {
      console.error('Failed to load alert words:', error);
      showToast('error', 'Không thể tải từ khóa cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = activeCategory === 'Tất cả'
    ? words
    : words.filter(w => w.category === activeCategory);

  // Count words per category
  const counts: Record<string, number> = {
    'Tất cả': words.length,
    'Tài chính': words.filter(w => w.category === 'Tài chính').length,
    'Bạo lực': words.filter(w => w.category === 'Bạo lực').length,
    'Ma túy': words.filter(w => w.category === 'Ma túy').length,
    'Khác': words.filter(w => w.category === 'Khác').length,
  };

  return (
    <div className="page vocabulary-page">
      <div className="page-header">
        <div>
          <h1>⚠️ Từ ngữ cảnh báo</h1>
          <p className="page-description">
            Quản lý các từ khóa nhạy cảm để phát hiện tự động trong phiên âm
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">📥 Import</button>
          <button className="btn btn-secondary">📤 Export</button>
          <button
            className="btn btn-primary"
            onClick={() => openModal('alert-word-modal')}
          >
            ➕ Thêm từ khóa
          </button>
        </div>
      </div>

      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
        counts={counts}
      />

      <div className="page-content">
        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner">⏳</span>
            <p>Đang tải...</p>
          </div>
        ) : (
          <AlertWordTable words={filteredWords} onRefresh={loadWords} />
        )}
      </div>

      <AlertWordModal onSuccess={loadWords} />
    </div>
  );
}
