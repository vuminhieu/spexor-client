import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useUIStore } from '../../../stores';

interface ReplacementModalProps {
  onSuccess: () => void;
}

const categories = ['Địa danh', 'Tên riêng', 'Thuật ngữ', 'Chung'];

export function ReplacementModal({ onSuccess }: ReplacementModalProps) {
  const { activeModal, closeModal, showToast } = useUIStore();
  const [formData, setFormData] = useState({
    original: '',
    correct: '',
    category: 'Chung',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'replacement-modal') return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.original.trim()) {
      newErrors.original = 'Từ gốc là bắt buộc';
    }
    if (!formData.correct.trim()) {
      newErrors.correct = 'Từ đúng là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    closeModal();
    setFormData({ original: '', correct: '', category: 'Chung' });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await invoke('create_replacement_word', { input: formData });
      showToast('success', 'Đã thêm từ thay thế');
      handleClose();
      onSuccess();
    } catch (error) {
      showToast('error', 'Không thể thêm từ thay thế');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔄 Thêm từ thay thế</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>
                Từ gốc (AI nhận dạng sai) <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.original}
                onChange={(e) => setFormData(d => ({ ...d, original: e.target.value }))}
                placeholder="VD: Hanoi"
                className={errors.original ? 'error' : ''}
              />
              {errors.original && <span className="error-text">{errors.original}</span>}
            </div>
            <div className="form-group">
              <label>
                Từ đúng <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.correct}
                onChange={(e) => setFormData(d => ({ ...d, correct: e.target.value }))}
                placeholder="VD: Hà Nội"
                className={errors.correct ? 'error' : ''}
              />
              {errors.correct && <span className="error-text">{errors.correct}</span>}
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(d => ({ ...d, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
