import { useSpeakerStore } from '../../../stores';

interface TempSpeaker {
  id: string;
  label: string;
  duration: string;
  color: string;
}

const tempSpeakers: TempSpeaker[] = [
  { id: 'temp-a', label: 'A', duration: '2:45', color: '#3b82f6' },
  { id: 'temp-b', label: 'B', duration: '2:47', color: '#10b981' },
];

export function SpeakersPanel() {
  const { speakers } = useSpeakerStore();

  const handleAssign = (tempId: string, speakerId: string) => {
    console.log(`Assign ${tempId} to speaker ${speakerId}`);
    // TODO: Implement speaker assignment
  };

  return (
    <div className="panel-section speakers-panel">
      <div className="panel-header">
        <h3>🎤 Người nói</h3>
        <button className="btn btn-sm">+ Thêm</button>
      </div>
      <div className="speaker-list">
        {tempSpeakers.map(temp => (
          <div key={temp.id} className="speaker-item">
            <div
              className="speaker-avatar"
              style={{ background: temp.color }}
            >
              {temp.label}
            </div>
            <div className="speaker-info">
              <div className="speaker-select-wrapper">
                <select
                  className="speaker-select"
                  onChange={(e) => handleAssign(temp.id, e.target.value)}
                >
                  <option value="">-- Chọn người nói --</option>
                  {speakers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                  <option value="new">➕ Thêm người nói mới...</option>
                </select>
              </div>
              <span className="speaker-duration">{temp.duration}</span>
            </div>
            <button className="btn-icon" title="Xóa">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
