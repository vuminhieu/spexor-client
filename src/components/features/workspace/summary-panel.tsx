import { useState } from 'react';
import { useUIStore } from '../../../stores';

type SummaryLevel = 'short' | 'medium' | 'detailed';

const summaries = {
  short: {
    topic: 'Giao dịch tài chính',
    content: 'Cuộc họp về chuyển khoản 500 triệu, hẹn gặp lúc 15:00.',
  },
  medium: {
    topic: 'Giao dịch tài chính',
    points: [
      'Thảo luận về giao dịch chuyển khoản',
      'Số tiền: 500 triệu đồng',
      'Hẹn gặp mặt lúc 15:00',
    ],
  },
  detailed: {
    topic: 'Giao dịch tài chính - Chuyển khoản liên ngân hàng',
    points: [
      { label: 'Bối cảnh', value: 'Cuộc gọi giữa 2 đối tượng bàn về giao dịch tài chính' },
      { label: 'Nội dung giao dịch', value: 'Thảo luận về việc chuyển khoản số tiền lớn' },
      { label: 'Số tiền', value: '500 triệu đồng (năm trăm triệu đồng)' },
      { label: 'Phương thức', value: 'Chuyển khoản ngân hàng' },
      { label: 'Lịch hẹn', value: 'Gặp mặt trực tiếp lúc 15:00' },
      { label: 'Cảnh báo', value: 'Phát hiện 2 từ khóa nhạy cảm' },
    ],
    participants: ['Speaker A (Đối tượng A)', 'Speaker B (Đối tượng B)'],
  },
};

export function SummaryPanel() {
  const [level, setLevel] = useState<SummaryLevel>('medium');
  const [loading, setLoading] = useState(false);
  const { showToast } = useUIStore();

  const copyToClipboard = () => {
    const summary = summaries[level];
    const text = level === 'short'
      ? `Chủ đề: ${summary.topic}\n${(summary as typeof summaries.short).content}`
      : `Chủ đề: ${summary.topic}\n${(summary as typeof summaries.medium).points?.join('\n') || ''}`;

    navigator.clipboard.writeText(text);
    showToast('success', 'Đã sao chép tóm tắt');
  };

  const generateSummary = () => {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setLoading(false);
      showToast('success', 'Đã tạo tóm tắt AI');
    }, 1500);
  };

  return (
    <div className="panel-section summary-panel">
      <div className="panel-header">
        <h3>🤖 Tóm tắt AI</h3>
        <div className="panel-actions">
          <button
            className="btn-icon"
            onClick={copyToClipboard}
            title="Sao chép"
          >
            📋
          </button>
          <button
            className="btn btn-sm"
            onClick={generateSummary}
            disabled={loading}
          >
            {loading ? '⏳' : '🔄'} Tạo
          </button>
        </div>
      </div>

      <div className="summary-level-selector">
        <label>Mức độ:</label>
        <div className="level-buttons">
          {(['short', 'medium', 'detailed'] as const).map(l => (
            <button
              key={l}
              className={`level-btn ${level === l ? 'active' : ''}`}
              onClick={() => setLevel(l)}
            >
              {l === 'short' ? 'Ngắn' : l === 'medium' ? 'Trung bình' : 'Chi tiết'}
            </button>
          ))}
        </div>
      </div>

      <div className="summary-content-card">
        <div className="summary-topic">
          <span className="topic-label">Chủ đề:</span>
          <span className="topic-value">{summaries[level].topic}</span>
        </div>

        {level === 'short' && (
          <div className="summary-main">
            <span className="main-label">Tóm tắt:</span>
            <p className="summary-brief">{summaries.short.content}</p>
          </div>
        )}

        {level === 'medium' && (
          <div className="summary-main">
            <span className="main-label">Ý chính:</span>
            <ul className="summary-points">
              {summaries.medium.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}

        {level === 'detailed' && (
          <>
            <div className="summary-main">
              <span className="main-label">Nội dung chi tiết:</span>
              <ul className="summary-points detailed">
                {summaries.detailed.points.map((p, i) => (
                  <li key={i}><strong>{p.label}:</strong> {p.value}</li>
                ))}
              </ul>
            </div>
            <div className="summary-participants">
              <span className="main-label">Người tham gia:</span>
              <div className="participant-tags">
                {summaries.detailed.participants.map((p, i) => (
                  <span key={i} className="participant-tag">{p}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
