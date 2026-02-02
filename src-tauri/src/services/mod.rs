//! Services module for business logic
//!
//! Contains database connection and other backend services

pub mod auth_service;
pub mod database;

pub use database::{get_pool, init_db};
