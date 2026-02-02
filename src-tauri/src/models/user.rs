//! User model with authentication
use crate::schema::users;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Queryable, Selectable, Serialize)]
#[diesel(table_name = users)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub role: String,
    pub avatar: Option<String>,
    pub username: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub is_active: i32,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub name: String,
    pub email: String,
    pub role: String,
    pub avatar: Option<String>,
    pub username: String,
    pub password_hash: String,
}

#[derive(Debug, AsChangeset, Deserialize, Default)]
#[diesel(table_name = users)]
pub struct UpdateUser {
    pub name: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
    pub avatar: Option<String>,
    pub is_active: Option<i32>,
}

/// Response for login (excludes password_hash)
#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub role: String,
    pub username: String,
    pub is_active: bool,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            username: user.username,
            is_active: user.is_active == 1,
        }
    }
}
