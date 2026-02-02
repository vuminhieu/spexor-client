import { useAudioStore } from '../../../stores';

interface Alert {
  word: string;
  time: string;
  seconds: number;
}

const mockAlerts: Alert[] = [
  { word: 'chuyển khoản', time: '00:08', seconds: 8 },
  { word: 'tiền mặt', time: '00:22', seconds: 22 },
];

export function AlertsPanel() {
  const { setCurrentTime, setIsPlaying } = useAudioStore();

  const jumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  return (
    <div className="panel-section alerts-panel">
      <div className="panel-header">
        <h3>⚠️ Từ cảnh báo</h3>
        <span className="badge badge-danger">{mockAlerts.length}</span>
      </div>
      <div className="alerts-list">
        {mockAlerts.length === 0 ? (
          <p className="text-muted">Không có từ cảnh báo trong đoạn hội thoại</p>
        ) : (
          mockAlerts.map((alert, i) => (
            <div
              key={i}
              className="alert-item"
              onClick={() => jumpToTime(alert.seconds)}
            >
              <span className="alert-word">{alert.word}</span>
              <span className="alert-time">{alert.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
