import { useUIStore } from '../../stores';

export function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast) return null;

  const icons: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type] || 'ℹ️'}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={hideToast}>×</button>
    </div>
  );
}
