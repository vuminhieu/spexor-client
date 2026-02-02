import { useState } from 'react';
import { useAudioStore } from '../../../stores';
import { TranscriptSegment } from './transcript-segment';
import { RestoreBar } from './restore-bar';

const mockSegments = [
  { id: 1, speakerId: 1, startTime: 0, endTime: 15, text: 'Xin chào, tôi muốn hỏi về vụ việc <mark>chuyển khoản</mark> hôm qua.', isDeleted: false },
  { id: 2, speakerId: 2, startTime: 16, endTime: 35, text: 'Vâng, tôi đã nhận được thông tin. Số <mark>tiền mặt</mark> là bao nhiêu?', isDeleted: false },
  { id: 3, speakerId: 1, startTime: 36, endTime: 55, text: 'Khoảng năm trăm triệu. Chúng ta có thể gặp mặt để bàn chi tiết không?', isDeleted: false },
  { id: 4, speakerId: 2, startTime: 56, endTime: 80, text: 'Được, chiều nay 3 giờ tại quán cà phê như đã hẹn nhé.', isDeleted: false },
];

const speakerColors: Record<string, string> = {
  '1': '#3b82f6',
  '2': '#10b981',
  '3': '#f59e0b',
  '4': '#ef4444',
};

export function TranscriptSection() {
  const { segments: storeSegments, setCurrentTime, setIsPlaying } = useAudioStore();
  const [localSegments, setLocalSegments] = useState(mockSegments);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use store segments if available, otherwise mock
  const displaySegments = storeSegments.length > 0
    ? storeSegments.map(s => ({ ...s, isDeleted: false }))
    : localSegments;

  const deletedCount = localSegments.filter(s => s.isDeleted).length;

  const deleteSegment = (id: number) => {
    setLocalSegments(segs => segs.map(s =>
      s.id === id ? { ...s, isDeleted: true } : s
    ));
  };

  const restoreAll = () => {
    setLocalSegments(segs => segs.map(s => ({ ...s, isDeleted: false })));
  };

  const handlePlay = (startTime: number) => {
    setCurrentTime(startTime);
    setIsPlaying(true);
  };

  // Filter segments by search term
  const filteredSegments = displaySegments.filter(s =>
    !s.isDeleted &&
    (searchTerm === '' || s.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="transcript-section">
      <div className="transcript-header">
        <h3>📝 Phiên âm</h3>
        <div className="transcript-actions">
          <div className="search-box small">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-sm">📋 Sao chép</button>
          <button className="btn btn-sm">📥 Xuất</button>
        </div>
      </div>

      {deletedCount > 0 && (
        <RestoreBar count={deletedCount} onRestore={restoreAll} />
      )}

      <div className="transcript-content">
        {filteredSegments.length === 0 ? (
          <div className="empty-state-small">
            <p>
              {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có phiên âm. Upload file audio để bắt đầu.'}
            </p>
          </div>
        ) : (
          filteredSegments.map(segment => (
            <TranscriptSegment
              key={segment.id}
              segment={segment}
              speakerColors={speakerColors}
              isActive={segment.id === activeId}
              onClick={() => setActiveId(segment.id)}
              onDelete={() => deleteSegment(segment.id)}
              onPlay={() => handlePlay(segment.startTime)}
            />
          ))
        )}
      </div>
    </div>
  );
}
