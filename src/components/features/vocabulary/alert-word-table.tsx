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
    if (!confirm('Xóa từ khóa cảnh báo này?')) return;

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
        <div className="empty-icon">⚠️</div>
        <h3>Chưa có từ khóa nào</h3>
        <p>Nhấn "Thêm từ khóa" để thêm từ ngữ cảnh báo mới.</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tài chính': return '#3b82f6';
      case 'Bạo lực': return '#ef4444';
      case 'Ma túy': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="vocabulary-table">
      <table className="table">
        <thead>
          <tr>
            <th>Từ khóa</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th style={{ width: '100px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td>
                <span className="keyword-badge">{word.keyword}</span>
              </td>
              <td>
                <span
                  className="category-badge"
                  style={{ background: getCategoryColor(word.category) }}
                >
                  {word.category}
                </span>
              </td>
              <td className="description-cell">{word.description || '—'}</td>
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
