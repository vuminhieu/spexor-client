import { useEffect } from 'react';
import { useCaseStore, useUIStore, useAudioStore } from '../stores';
import { AudioFilesPanel } from '../components/features/audio/audio-files-panel';
import { AudioPlayer } from '../components/features/audio/audio-player';
import { TranscriptSection } from '../components/features/transcript/transcript-section';
import { WorkspaceRightPanel } from '../components/features/workspace/right-panel';

export function WorkspacePage() {
  const { currentCase, audioFiles, fetchAudioFiles } = useCaseStore();
  const { setPage, showToast } = useUIStore();
  const { reset } = useAudioStore();

  useEffect(() => {
    if (currentCase) {
      fetchAudioFiles(currentCase.id);
    }
    return () => reset(); // Reset audio state on unmount
  }, [currentCase, fetchAudioFiles, reset]);

  if (!currentCase) {
    return (
      <div className="page workspace-page">
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Không có sự vụ được chọn</h3>
          <p>Vui lòng chọn một sự vụ để bắt đầu làm việc</p>
          <button
            className="btn btn-primary"
            onClick={() => setPage('cases')}
          >
            Quay lại danh sách sự vụ
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    showToast('success', 'Đã lưu thay đổi thành công');
  };

  const handleExportWord = () => {
    showToast('info', 'Đang xuất file Word...');
  };

  const handleExportPdf = () => {
    showToast('info', 'Đang xuất file PDF...');
  };

  return (
    <div className="page workspace-page">
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-header-left">
          <div className="workspace-breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('cases'); }}>
              📁 Sự vụ
            </a>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{currentCase.code}</span>
          </div>
          <div className="case-info-panel">
            <div className="case-info-row">
              <label>Tiêu đề:</label>
              <input
                type="text"
                className="case-title-input"
                defaultValue={currentCase.title}
                placeholder="Nhập tiêu đề sự vụ"
              />
            </div>
            <div className="case-info-row">
              <label>Mô tả:</label>
              <input
                type="text"
                className="case-desc-input"
                defaultValue={currentCase.description || ''}
                placeholder="Mô tả chi tiết..."
              />
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExportWord}>
            📄 Export Word
          </button>
          <button className="btn btn-secondary" onClick={handleExportPdf}>
            📑 Export PDF
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Lưu
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="workspace-container">
        <AudioFilesPanel files={audioFiles} />

        <div className="workspace-main">
          <AudioPlayer />
          <TranscriptSection />
        </div>

        <WorkspaceRightPanel />
      </div>
    </div>
  );
}
