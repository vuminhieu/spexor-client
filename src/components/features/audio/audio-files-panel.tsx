import { useState } from 'react';
import { useAudioStore, useUIStore } from '../../../stores';
import type { AudioFile } from '../../../types';

interface AudioFilesPanelProps {
  files: AudioFile[];
}

export function AudioFilesPanel({ files }: AudioFilesPanelProps) {
  const { openModal, showToast } = useUIStore();
  const { setCurrentAudioFile } = useAudioStore();
  const [selectedFileId, setSelectedFileId] = useState<number | null>(
    files[0]?.id || null
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="audio-status completed" title="Hoàn thành">✓</span>;
      case 'processing':
        return <span className="audio-status processing" title="Đang xử lý">⏳</span>;
      case 'error':
        return <span className="audio-status error" title="Lỗi">❌</span>;
      default:
        return <span className="audio-status pending" title="Chờ xử lý">○</span>;
    }
  };

  const handleSelectFile = (file: AudioFile) => {
    setSelectedFileId(file.id);
    setCurrentAudioFile(file);
  };

  const handleReanalyze = (_id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('info', 'Đang phân tích lại file audio...');
  };

  const handleDelete = (_id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Xóa file audio này? Tất cả transcript sẽ bị xóa.')) {
      showToast('success', 'Đã xóa file audio');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="audio-files-panel">
      <div className="panel-header">
        <h3>🎵 File Audio</h3>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => openModal('upload-modal')}
        >
          + Upload
        </button>
      </div>

      <div className="audio-list">
        {files.length === 0 ? (
          <div className="empty-state-small">
            <p>Chưa có file audio</p>
            <button
              className="btn btn-sm"
              onClick={() => openModal('upload-modal')}
            >
              Upload file đầu tiên
            </button>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`audio-item ${selectedFileId === file.id ? 'active' : ''}`}
              onClick={() => handleSelectFile(file)}
            >
              <span className="audio-icon">🎵</span>
              <div className="audio-info">
                <span className="audio-name" title={file.fileName}>
                  {file.fileName}
                </span>
                <span className="audio-duration">
                  {formatDuration(file.duration)}
                </span>
                {file.status === 'processing' && (
                  <div className="audio-progress">
                    <div className="audio-progress-bar" style={{ width: '65%' }} />
                    <span className="audio-progress-text">65%</span>
                  </div>
                )}
              </div>
              {getStatusIcon(file.status)}
              <div className="audio-actions">
                <button
                  className="audio-action-btn"
                  onClick={(e) => handleReanalyze(file.id, e)}
                  title="Phân tích lại"
                >
                  🔄
                </button>
                <button
                  className="audio-delete-btn"
                  onClick={(e) => handleDelete(file.id, e)}
                  title="Xóa file"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
