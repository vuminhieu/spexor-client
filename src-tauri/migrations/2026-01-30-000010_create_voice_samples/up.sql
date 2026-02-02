-- Create voice_samples table
CREATE TABLE voice_samples (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    speaker_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    duration REAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE
);
