//! Database service for connection pooling and migrations
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager, Pool};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use std::sync::OnceLock;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

pub type DbPool = Pool<ConnectionManager<SqliteConnection>>;

static DB_POOL: OnceLock<DbPool> = OnceLock::new();

/// Initialize the database connection pool and run pending migrations
pub fn init_db(app_dir: &std::path::Path) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let db_path = app_dir.join("spexor.db");
    let db_url = db_path.to_str().ok_or("Invalid database path")?;

    println!("Initializing database at: {}", db_url);

    let manager = ConnectionManager::<SqliteConnection>::new(db_url);
    let pool = r2d2::Pool::builder().max_size(5).build(manager)?;

    // Run pending migrations
    {
        let mut conn = pool.get()?;
        conn.run_pending_migrations(MIGRATIONS)
            .map_err(|e| format!("Migration error: {}", e))?;
        println!("Database migrations completed successfully");
    }

    // Seed admin user if not exists
    {
        let mut conn = pool.get()?;
        seed_admin_user(&mut conn)?;
    }

    DB_POOL.set(pool).map_err(|_| "Failed to set DB pool")?;
    Ok(())
}

/// Seed admin user if not exists
fn seed_admin_user(
    conn: &mut SqliteConnection,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::users::dsl::*;
    use diesel::dsl::count;

    // Check if admin exists
    let admin_count: i64 = users
        .filter(username.eq("admin"))
        .select(count(id))
        .first(conn)?;

    if admin_count == 0 {
        // Hash password "admin"
        let password_hashed = bcrypt::hash("admin", bcrypt::DEFAULT_COST)
            .map_err(|e| format!("Failed to hash password: {}", e))?;

        diesel::insert_into(users)
            .values((
                name.eq("Administrator"),
                email.eq("admin@spexor.local"),
                role.eq("admin"),
                username.eq("admin"),
                password_hash.eq(password_hashed),
                is_active.eq(1),
            ))
            .execute(conn)?;

        println!("Admin user created (username: admin, password: admin)");
    }

    Ok(())
}

/// Get a reference to the database pool
pub fn get_pool() -> &'static DbPool {
    DB_POOL
        .get()
        .expect("Database not initialized. Call init_db first.")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_db_init() {
        let temp_dir = std::env::temp_dir().join("spexor_test");
        std::fs::create_dir_all(&temp_dir).unwrap();

        let result = init_db(&temp_dir);
        assert!(
            result.is_ok(),
            "Database initialization failed: {:?}",
            result.err()
        );

        // Cleanup
        let _ = std::fs::remove_dir_all(temp_dir);
    }
}
