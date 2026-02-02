import { useSpeakerStore, useUIStore } from '../../../stores';
import type { Speaker } from '../../../types';

interface SpeakerCardProps {
  speaker: Speaker;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const { setCurrentSpeaker, deleteSpeaker } = useSpeakerStore();
  const { openModal, showToast } = useUIStore();

  const handleEdit = () => {
    setCurrentSpeaker(speaker);
    openModal('speaker-modal');
  };

  const handleDelete = async () => {
    if (confirm(`Xóa người nói "${speaker.name}"?`)) {
      try {
        await deleteSpeaker(speaker.id);
        showToast('success', 'Đã xóa người nói');
      } catch {
        showToast('error', 'Không thể xóa người nói');
      }
    }
  };

  const handleVoiceProfile = () => {
    setCurrentSpeaker(speaker);
    openModal('voice-profile-modal');
    showToast('info', 'Voice profile modal (coming soon)');
  };

  const genderLabel = speaker.gender === 'male' ? 'Nam' :
    speaker.gender === 'female' ? 'Nữ' : '';

  return (
    <div className="speaker-card">
      <div className="speaker-photo">
        <span className="speaker-avatar-icon">👤</span>
      </div>
      <div className="speaker-details">
        <h4>{speaker.name}</h4>
        {speaker.alias && (
          <span className="speaker-alias">Biệt danh: "{speaker.alias}"</span>
        )}
        <div className="speaker-meta">
          {genderLabel && <span className="meta-tag">{genderLabel}</span>}
          {speaker.ageEstimate && (
            <span className="meta-tag">{speaker.ageEstimate} tuổi</span>
          )}
        </div>
        <div className="speaker-stats">
          <span>📁 0 sự vụ</span>
          <span>🕐 0h 0m</span>
        </div>
      </div>
      <div className="speaker-actions">
        <button
          className="btn btn-sm btn-outline"
          onClick={handleVoiceProfile}
        >
          🎤 Voice
        </button>
        <button className="btn-icon" onClick={handleEdit} title="Sửa">
          ✏️
        </button>
        <button className="btn-icon" onClick={handleDelete} title="Xóa">
          🗑️
        </button>
      </div>
    </div>
  );
}
