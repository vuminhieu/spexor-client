//! Authentication service
use crate::models::user::{User, UserResponse};
use crate::services::database::DbPool;
use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::prelude::*;

#[derive(Debug)]
pub enum AuthError {
    DatabaseError(String),
    InvalidCredentials,
    AccountDisabled,
    HashError,
}

impl std::fmt::Display for AuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AuthError::DatabaseError(e) => write!(f, "Database error: {}", e),
            AuthError::InvalidCredentials => write!(f, "Invalid username or password"),
            AuthError::AccountDisabled => write!(f, "Account is disabled"),
            AuthError::HashError => write!(f, "Password hash error"),
        }
    }
}

impl std::error::Error for AuthError {}

pub fn login(
    pool: &DbPool,
    username_input: &str,
    password_input: &str,
) -> Result<UserResponse, AuthError> {
    use crate::schema::users::dsl::*;

    let mut conn = pool
        .get()
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?;

    let user = users
        .filter(username.eq(username_input))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?
        .ok_or(AuthError::InvalidCredentials)?;

    // Check if account is active
    if user.is_active != 1 {
        return Err(AuthError::AccountDisabled);
    }

    // Verify password
    if !verify(password_input, &user.password_hash).unwrap_or(false) {
        return Err(AuthError::InvalidCredentials);
    }

    Ok(UserResponse::from(user))
}

pub fn hash_password(password: &str) -> Result<String, AuthError> {
    hash(password, DEFAULT_COST).map_err(|_| AuthError::HashError)
}

pub fn get_user_by_id(pool: &DbPool, user_id: i32) -> Result<Option<UserResponse>, AuthError> {
    use crate::schema::users::dsl::*;

    let mut conn = pool
        .get()
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?;

    let user = users
        .filter(id.eq(user_id))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?;

    Ok(user.map(UserResponse::from))
}

pub fn change_password(
    pool: &DbPool,
    user_id: i32,
    current_password: &str,
    new_password: &str,
) -> Result<(), AuthError> {
    use crate::schema::users::dsl::*;

    let mut conn = pool
        .get()
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?;

    // Get user and verify current password
    let user = users
        .filter(id.eq(user_id))
        .first::<User>(&mut conn)
        .optional()
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?
        .ok_or(AuthError::InvalidCredentials)?;

    if !verify(current_password, &user.password_hash).unwrap_or(false) {
        return Err(AuthError::InvalidCredentials);
    }

    // Hash new password and update
    let new_hash = hash_password(new_password)?;
    diesel::update(users.filter(id.eq(user_id)))
        .set(password_hash.eq(new_hash))
        .execute(&mut conn)
        .map_err(|e| AuthError::DatabaseError(e.to_string()))?;

    Ok(())
}
