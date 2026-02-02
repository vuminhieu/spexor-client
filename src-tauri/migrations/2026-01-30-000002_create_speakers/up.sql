-- Create speakers table (before audio_files due to FK in transcript_segments)
CREATE TABLE speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    alias TEXT,
    gender TEXT,
    age_estimate TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
