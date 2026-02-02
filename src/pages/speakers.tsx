import { useEffect } from 'react';
import { useSpeakerStore, useUIStore } from '../stores';
import { SpeakerGrid } from '../components/features/speakers/speaker-grid';
import { SpeakerModal } from '../components/features/speakers/speaker-modal';

export function SpeakersPage() {
  const { speakers, fetchSpeakers, loading } = useSpeakerStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  return (
    <div className="page speakers-page">
      <div className="page-header">
        <div>
          <h1>👤 Quản lý người nói</h1>
          <p className="page-description">
            Quản lý hồ sơ người nói và voice samples để nhận diện tự động
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => openModal('speaker-modal')}
          >
            ➕ Thêm người nói
          </button>
        </div>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner">⏳</span>
            <p>Đang tải danh sách người nói...</p>
          </div>
        ) : (
          <SpeakerGrid speakers={speakers} />
        )}
      </div>

      <SpeakerModal />
    </div>
  );
}
