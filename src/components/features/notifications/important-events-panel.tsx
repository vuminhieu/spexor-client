import { useSettingsStore } from '../../../stores';

interface ImportantEventsPanelProps {
  onClose: () => void;
}

const eventTypes = [
  { id: 'alert', label: '⚠️ Cảnh báo phát hiện từ khóa' },
  { id: 'success', label: '✅ Hoàn thành transcription' },
  { id: 'create', label: '📁 Tạo sự vụ mới' },
  { id: 'update', label: '✏️ Cập nhật dữ liệu' },
  { id: 'delete', label: '🗑️ Xóa dữ liệu' },
  { id: 'export', label: '📤 Export báo cáo' },
  { id: 'import', label: '📥 Import dữ liệu' },
  { id: 'login', label: '🔐 Đăng nhập/Đăng xuất' },
];

export function ImportantEventsPanel({ onClose }: ImportantEventsPanelProps) {
  const { importantEvents, updateImportantEvents, resetImportantEvents } = useSettingsStore();

  const toggle = (id: keyof typeof importantEvents) => {
    updateImportantEvents({ [id]: !importantEvents[id] });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal important-events-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⭐ Cấu hình sự kiện quan trọng</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="important-events-desc">
            Chọn các loại sự kiện bạn muốn được đánh dấu là quan trọng:
          </p>
          <div className="important-events-options">
            {eventTypes.map(event => (
              <label key={event.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={importantEvents[event.id as keyof typeof importantEvents] || false}
                  onChange={() => toggle(event.id as keyof typeof importantEvents)}
                />
                <span>{event.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={resetImportantEvents}>
            Đặt mặc định
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            ✓ Xong
          </button>
        </div>
      </div>
    </div>
  );
}
