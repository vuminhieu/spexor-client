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
      showToast('success', 'Đã xóa từ thay thế');
      onRefresh();
    } catch (error) {
      showToast('error', 'Không thể xóa');
    }
  };

  if (words.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔄</div>
        <h3>Chưa có từ thay thế nào</h3>
        <p>Nhấn "Thêm từ thay thế" để thêm từ ngữ cần sửa tự động.</p>
      </div>
    );
  }

  return (
    <div className="vocabulary-table">
      <table className="table">
        <thead>
          <tr>
            <th>Từ gốc (AI nhận dạng)</th>
            <th style={{ width: '40px', textAlign: 'center' }}>→</th>
            <th>Từ đúng</th>
            <th>Danh mục</th>
            <th style={{ width: '100px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td>
                <span className="word-original">{word.original}</span>
              </td>
              <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>→</td>
              <td>
                <span className="word-correct">{word.correct}</span>
              </td>
              <td>
                <span className="category-tag">{word.category || 'Chung'}</span>
              </td>
              <td>
                <div className="actions-cell">
                  <button className="btn-icon" title="Sửa">✏️</button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(word.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
