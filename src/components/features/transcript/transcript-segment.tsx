interface SegmentProps {
  segment: {
    id: number;
    startTime: number;
    endTime: number;
    speakerId: number | null;
    text: string;
  };
  speakerColors: Record<string, string>;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onPlay: () => void;
}

export function TranscriptSegment({
  segment,
  speakerColors,
  isActive,
  onClick,
  onDelete,
  onPlay
}: SegmentProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const speakerLabel = segment.speakerId ? `Người nói ${segment.speakerId}` : 'Chưa xác định';
  const speakerColor = speakerColors[String(segment.speakerId)] || '#6b7280';

  // Highlight alert words (words wrapped in <mark>)
  const highlightedText = segment.text
    .replace(/<mark>/g, '<span class="highlight-alert">')
    .replace(/<\/mark>/g, '</span>');

  return (
    <div
      className={`transcript-segment ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="segment-header">
        <span
          className="speaker-badge"
          style={{ background: speakerColor }}
        >
          {speakerLabel}
        </span>
        <span className="segment-time">
          {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
        </span>
      </div>

      <p
        className="segment-text"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />

      <div className="segment-actions">
        <button
          className="btn-icon"
          title="Phát đoạn này"
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
        >
          ▶️
        </button>
        <button
          className="btn-icon"
          title="Xóa đoạn này"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
