import { useRef, useEffect } from 'react';
import { useAudioStore } from '../../../stores';
import { Waveform } from './waveform';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setPlaybackSpeed
  } = useAudioStore();

  // Demo mode - simulate playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && duration > 0) {
      interval = setInterval(() => {
        setCurrentTime(Math.min(currentTime + 0.1, duration));
        if (currentTime >= duration) {
          setIsPlaying(false);
        }
      }, 100 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, playbackSpeed, setCurrentTime, setIsPlaying]);

  // Set initial demo duration
  useEffect(() => {
    if (duration === 0) {
      setDuration(332); // 5:32 demo
    }
  }, [duration, setDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, currentTime + seconds)));
  };

  const seekTo = (percentage: number) => {
    setCurrentTime(duration * percentage);
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="audio-player-section">
      <audio ref={audioRef} />

      {/* Waveform */}
      <Waveform
        progress={progress}
        onSeek={seekTo}
      />

      {/* Controls */}
      <div className="player-controls">
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="separator">/</span>
          <span className="total-time">{formatTime(duration)}</span>
        </div>

        <div className="control-buttons">
          <button
            className="control-btn"
            onClick={() => setCurrentTime(0)}
            title="Về đầu"
          >
            ⏮️
          </button>
          <button
            className="control-btn"
            onClick={() => skip(-10)}
            title="Lùi 10s"
          >
            ⏪
          </button>
          <button
            className="control-btn play-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Dừng' : 'Phát'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            className="control-btn"
            onClick={() => skip(10)}
            title="Tiến 10s"
          >
            ⏩
          </button>
          <button
            className="control-btn"
            onClick={() => setCurrentTime(duration)}
            title="Về cuối"
          >
            ⏭️
          </button>
        </div>

        <div className="speed-control">
          <label>Tốc độ:</label>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
