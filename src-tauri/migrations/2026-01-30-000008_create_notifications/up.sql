-- Create notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    notification_type TEXT NOT NULL,
    action TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    entity_type TEXT,
    entity_id INTEGER,
    is_read INTEGER NOT NULL DEFAULT 0,
    is_important INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
