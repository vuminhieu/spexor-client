import { useRef } from 'react';

interface AudioUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function AudioUpload({ files, onFilesChange }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('audio/')
    );
    onFilesChange([...files, ...droppedFiles]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="audio-upload">
      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={handleSelect}
        />
        <span className="upload-icon">📁</span>
        <p>Kéo thả file audio vào đây hoặc click để chọn</p>
        <small>Hỗ trợ: .wav, .mp3, .m4a, .flac</small>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="uploaded-file">
              <span className="file-icon">🎵</span>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeFile(index)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
