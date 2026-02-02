import { SpeakerCard } from './speaker-card';
import type { Speaker } from '../../../types';

interface SpeakerGridProps {
  speakers: Speaker[];
}

export function SpeakerGrid({ speakers }: SpeakerGridProps) {
  if (speakers.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👤</div>
        <h3>Chưa có người nói nào</h3>
        <p>Nhấn "Thêm người nói" để tạo hồ sơ người nói mới.</p>
      </div>
    );
  }

  return (
    <div className="speakers-grid">
      {speakers.map(speaker => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  );
}
