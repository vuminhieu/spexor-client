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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'alert-word-modal') return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.keyword.trim()) {
      newErrors.keyword = 'Từ khóa là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    closeModal();
    setFormData({ keyword: '', category: 'Khác', description: '' });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await invoke('create_alert_word', { input: formData });
      showToast('success', 'Đã thêm từ khóa cảnh báo');
      handleClose();
      onSuccess();
    } catch (error) {
      showToast('error', 'Không thể thêm từ khóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚠️ Thêm từ khóa cảnh báo</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>
                Từ khóa <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData(d => ({ ...d, keyword: e.target.value }))}
                placeholder="Nhập từ khóa cần cảnh báo"
                className={errors.keyword ? 'error' : ''}
              />
              {errors.keyword && <span className="error-text">{errors.keyword}</span>}
            </div>
            <div className="form-group">
              <label>
                Danh mục <span className="required">*</span>
              </label>
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
                placeholder="Mô tả ý nghĩa hoặc ngữ cảnh sử dụng..."
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳' : '💾'} Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
