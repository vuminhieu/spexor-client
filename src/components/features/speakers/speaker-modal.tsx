import { useState, useEffect } from 'react';
import { useSpeakerStore, useUIStore } from '../../../stores';
import { VoiceSamples } from './voice-samples';

export function SpeakerModal() {
  const { activeModal, closeModal, showToast } = useUIStore();
  const { currentSpeaker, createSpeaker, updateSpeaker, setCurrentSpeaker } = useSpeakerStore();

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    gender: '',
    ageEstimate: '',
    notes: '',
  });
  const [voiceSamples, setVoiceSamples] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentSpeaker) {
      setFormData({
        name: currentSpeaker.name,
        alias: currentSpeaker.alias || '',
        gender: currentSpeaker.gender || '',
        ageEstimate: currentSpeaker.ageEstimate || '',
        notes: currentSpeaker.notes || '',
      });
    } else {
      setFormData({ name: '', alias: '', gender: '', ageEstimate: '', notes: '' });
    }
    setErrors({});
  }, [currentSpeaker, activeModal]);

  if (activeModal !== 'speaker-modal') return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tên người nói là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    closeModal();
    setCurrentSpeaker(null);
    setFormData({ name: '', alias: '', gender: '', ageEstimate: '', notes: '' });
    setVoiceSamples([]);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (currentSpeaker) {
        await updateSpeaker(currentSpeaker.id, formData);
        showToast('success', 'Đã cập nhật thông tin người nói');
      } else {
        await createSpeaker(formData);
        showToast('success', 'Đã thêm người nói mới');
      }
      handleClose();
    } catch (error) {
      showToast('error', 'Không thể lưu người nói');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!currentSpeaker;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Sửa người nói' : '➕ Thêm người nói mới'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Thông tin cơ bản */}
            <section className="form-section">
              <h3>👤 Thông tin cơ bản</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Tên người nói <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                    placeholder="Nhập tên"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Biệt danh</label>
                  <input
                    type="text"
                    value={formData.alias}
                    onChange={(e) => setFormData(d => ({ ...d, alias: e.target.value }))}
                    placeholder="Nhập biệt danh"
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(d => ({ ...d, gender: e.target.value }))}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="unknown">Không xác định</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Độ tuổi ước tính</label>
                  <input
                    type="text"
                    value={formData.ageEstimate}
                    onChange={(e) => setFormData(d => ({ ...d, ageEstimate: e.target.value }))}
                    placeholder="VD: 30-40"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mô tả/Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(d => ({ ...d, notes: e.target.value }))}
                    placeholder="Ghi chú thêm về người nói..."
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Voice Samples */}
            <section className="form-section">
              <h3>🎤 Voice Sample (để nhận dạng tự động)</h3>
              <VoiceSamples
                samples={voiceSamples}
                onSamplesChange={setVoiceSamples}
              />
            </section>
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
              {loading ? '⏳' : '💾'} {isEdit ? 'Cập nhật' : 'Lưu người nói'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
