import { useState } from 'react';
import { useCaseStore, useUIStore } from '../../../stores';
import { AudioUpload } from './audio-upload';
import { CaseSettings } from './case-settings';

export function CaseModal() {
  const { activeModal, closeModal, showToast } = useUIStore();
  const { createCase, loading } = useCaseStore();

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
  });
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [settings, setSettings] = useState({
    detectKeywords: true,
    speakerDiarization: true,
    aiSummary: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (activeModal !== 'case-modal') return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã sự vụ là bắt buộc';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.code)) {
      newErrors.code = 'Mã sự vụ chỉ chứa chữ cái, số và dấu gạch ngang';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createCase({
        code: formData.code.toUpperCase(),
        title: formData.title,
        description: formData.description || undefined,
      });
      showToast('success', 'Đã tạo sự vụ mới thành công');
      closeModal();
      resetForm();
    } catch (error) {
      showToast('error', `Không thể tạo sự vụ: ${error}`);
    }
  };

  const resetForm = () => {
    setFormData({ code: '', title: '', description: '' });
    setAudioFiles([]);
    setErrors({});
  };

  const handleClose = () => {
    closeModal();
    resetForm();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📁 Thêm sự vụ mới</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Thông tin sự vụ */}
            <section className="form-section">
              <h3>📋 Thông tin sự vụ</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã sự vụ <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(d => ({ ...d, code: e.target.value }))}
                    placeholder="VV-2026-001"
                    className={errors.code ? 'error' : ''}
                  />
                  {errors.code && <span className="error-text">{errors.code}</span>}
                </div>
                <div className="form-group">
                  <label>Tiêu đề <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(d => ({ ...d, title: e.target.value }))}
                    placeholder="Nhập tiêu đề sự vụ"
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>
                <div className="form-group full-width">
                  <label>Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(d => ({ ...d, description: e.target.value }))}
                    placeholder="Mô tả chi tiết về sự vụ..."
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* File Audio */}
            <section className="form-section">
              <h3>🎵 File Audio (tùy chọn)</h3>
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
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Đang lưu...' : '💾 Lưu sự vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
