interface RestoreBarProps {
  count: number;
  onRestore: () => void;
}

export function RestoreBar({ count, onRestore }: RestoreBarProps) {
  return (
    <div className="restore-bar">
      <span className="restore-info">
        <span className="restore-count">{count}</span> đoạn đã bị ẩn
      </span>
      <button className="btn btn-sm restore-btn" onClick={onRestore}>
        ↩️ Khôi phục tất cả
      </button>
    </div>
  );
}
