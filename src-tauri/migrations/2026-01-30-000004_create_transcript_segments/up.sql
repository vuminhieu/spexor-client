-- Create transcript_segments table
CREATE TABLE transcript_segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    audio_file_id INTEGER NOT NULL,
    speaker_id INTEGER,
    start_time REAL NOT NULL,
    end_time REAL NOT NULL,
    text TEXT NOT NULL,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audio_file_id) REFERENCES audio_files(id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE SET NULL
);
