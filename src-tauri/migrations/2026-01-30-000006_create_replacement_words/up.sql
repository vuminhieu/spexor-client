-- Create replacement_words table
CREATE TABLE replacement_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    original TEXT NOT NULL UNIQUE,
    correct TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Khác',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
