interface CaseSettingsProps {
  settings: {
    detectKeywords: boolean;
    speakerDiarization: boolean;
    aiSummary: boolean;
  };
  onSettingsChange: (settings: CaseSettingsProps['settings']) => void;
}

export function CaseSettings({ settings, onSettingsChange }: CaseSettingsProps) {
  const toggle = (key: keyof typeof settings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="case-settings">
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={settings.detectKeywords}
          onChange={() => toggle('detectKeywords')}
        />
        <div className="checkbox-content">
          <span className="checkbox-title">⚠️ Phát hiện từ khóa cảnh báo</span>
          <span className="checkbox-desc">Tự động phát hiện các từ khóa được đánh dấu trong transcript</span>
        </div>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={settings.speakerDiarization}
          onChange={() => toggle('speakerDiarization')}
        />
        <div className="checkbox-content">
          <span className="checkbox-title">🎤 Phân biệt người nói</span>
          <span className="checkbox-desc">Tự động phân tách và gán nhãn cho từng người nói</span>
        </div>
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={settings.aiSummary}
          onChange={() => toggle('aiSummary')}
        />
        <div className="checkbox-content">
          <span className="checkbox-title">🤖 Tóm tắt AI</span>
          <span className="checkbox-desc">Tạo bản tóm tắt nội dung cuộc hội thoại tự động</span>
        </div>
      </label>
    </div>
  );
}
