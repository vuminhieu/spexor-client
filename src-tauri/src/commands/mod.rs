//! Tauri commands module
//!
//! All commands are organized by domain and re-exported here for lib.rs registration.

pub mod activity_logs;
pub mod audio;
pub mod auth;
pub mod cases;
pub mod greet;
pub mod notifications;
pub mod speakers;
pub mod transcript;
pub mod users;
pub mod vocabulary;

// Re-export all commands for easy registration in lib.rs
pub use activity_logs::*;
pub use audio::*;
pub use cases::*;
pub use notifications::*;
pub use speakers::*;
pub use transcript::*;
pub use users::*;
pub use vocabulary::*;
