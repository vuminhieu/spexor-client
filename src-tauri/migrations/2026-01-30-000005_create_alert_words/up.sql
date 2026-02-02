-- Create alert_words table
CREATE TABLE alert_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    keyword TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'Khác',
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
