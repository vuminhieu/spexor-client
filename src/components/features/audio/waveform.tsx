interface WaveformProps {
  progress: number; // 0-1
  onSeek: (percentage: number) => void;
}

// Generate random bars for waveform visualization
const generateBars = () => Array.from({ length: 80 }, () => Math.random() * 70 + 15);
const bars = generateBars();

export function Waveform({ progress, onSeek }: WaveformProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, percentage)));
  };

  const progressIndex = Math.floor(progress * bars.length);

  return (
    <div className="waveform" onClick={handleClick}>
      <div className="waveform-visual">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`wave-bar ${i < progressIndex ? 'played' : ''}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div
        className="waveform-playhead"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}
