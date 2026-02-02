import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../stores';
import { ReplacementTable } from '../components/features/vocabulary/replacement-table';
import { ReplacementModal } from '../components/features/vocabulary/replacement-modal';
import type { ReplacementWord } from '../types';

export function ReplacementsPage() {
  const { openModal, showToast } = useUIStore();
  const [words, setWords] = useState<ReplacementWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    try {
      const data = await invoke<ReplacementWord[]>('get_replacement_words');
      setWords(data);
    } catch (error) {
      console.error('Failed to load replacement words:', error);
      showToast('error', 'Không thể tải từ thay thế');
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = searchTerm
    ? words.filter(w =>
      w.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.correct.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : words;

  return (
    <div className="page vocabulary-page">
      <div className="page-header">
        <div>
          <h1>🔄 Từ ngữ thay thế</h1>
          <p className="page-description">
            Quản lý các từ cần sửa tự động trong quá trình phiên âm
          </p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">📥 Import</button>
          <button
            className="btn btn-primary"
            onClick={() => openModal('replacement-modal')}
          >
            ➕ Thêm từ thay thế
          </button>
        </div>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner">⏳</span>
            <p>Đang tải...</p>
          </div>
        ) : (
          <>
            {words.length > 0 && (
              <div className="table-info">
                <span>Tổng cộng: <strong>{words.length}</strong> từ thay thế</span>
              </div>
            )}
            <ReplacementTable words={filteredWords} onRefresh={loadWords} />
          </>
        )}
      </div>

      <ReplacementModal onSuccess={loadWords} />
    </div>
  );
}
