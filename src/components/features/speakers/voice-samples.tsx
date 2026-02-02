import { useRef, useState } from 'react';

interface VoiceSamplesProps {
  samples: File[];
  onSamplesChange: (samples: File[]) => void;
}

interface SampleWithAudio {
  file: File;
  audio?: HTMLAudioElement;
  playing: boolean;
  duration: number;
}

export function VoiceSamples({ samples, onSamplesChange }: VoiceSamplesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sampleStates, setSampleStates] = useState<SampleWithAudio[]>([]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onSamplesChange([...samples, ...files]);

    // Create audio objects
    files.forEach(file => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setSampleStates(prev => [...prev, {
          file,
          audio,
          playing: false,
          duration: audio.duration,
        }]);
      };
    });
  };

  const togglePlay = (index: number) => {
    setSampleStates(prev => prev.map((s, i) => {
      if (i === index) {
        if (s.playing) {
          s.audio?.pause();
        } else {
          s.audio?.play();
        }
        return { ...s, playing: !s.playing };
      }
      return s;
    }));
  };

  const removeSample = (index: number) => {
    onSamplesChange(samples.filter((_, i) => i !== index));
    setSampleStates(prev => prev.filter((_, i) => i !== index));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="voice-samples">
      <div
        className="upload-zone small"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,.m4a,.flac"
          multiple
          hidden
          onChange={handleSelect}
        />
        <span className="upload-icon">📁</span>
        <p>Click để chọn file mẫu giọng nói</p>
        <small>Hỗ trợ: .wav, .mp3, .m4a, .flac</small>
      </div>

      {sampleStates.length > 0 && (
        <div className="voice-samples-list">
          {sampleStates.map((sample, index) => (
            <div key={index} className="voice-sample-item">
              <span className="sample-icon">🎵</span>
              <div className="sample-info">
                <span className="sample-name">{sample.file.name}</span>
                <span className="sample-meta">
                  {formatSize(sample.file.size)} • {formatDuration(sample.duration)}
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => togglePlay(index)}
                title={sample.playing ? 'Dừng' : 'Phát'}
              >
                {sample.playing ? '⏸️' : '▶️'}
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeSample(index)}
                title="Xóa"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
