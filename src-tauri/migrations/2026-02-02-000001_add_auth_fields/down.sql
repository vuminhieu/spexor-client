-- SQLite doesn't support DROP COLUMN directly
-- We need to recreate the table without the auth columns
CREATE TABLE users_backup AS SELECT id, name, email, role, avatar, created_at FROM users;
DROP TABLE users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users SELECT * FROM users_backup;
DROP TABLE users_backup;
