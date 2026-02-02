//! Data models for SPEXOR application
//!
//! This module contains all database models with Diesel ORM traits:
//! - Queryable: for SELECT operations
//! - Insertable: for INSERT operations
//! - AsChangeset: for UPDATE operations

// TODO: Remove this after Phase 03 implements CRUD commands
#![allow(unused)]

pub mod activity_log;
pub mod alert_word;
pub mod audio_file;
pub mod case;
pub mod notification;
pub mod replacement_word;
pub mod speaker;
pub mod transcript_segment;
pub mod user;
pub mod voice_sample;

// Re-exports for convenience
pub use activity_log::{ActivityLog, NewActivityLog};
pub use alert_word::{AlertWord, NewAlertWord, UpdateAlertWord};
pub use audio_file::{AudioFile, NewAudioFile, UpdateAudioFile};
pub use case::{Case, NewCase, UpdateCase};
pub use notification::{NewNotification, Notification, UpdateNotification};
pub use replacement_word::{NewReplacementWord, ReplacementWord, UpdateReplacementWord};
pub use speaker::{NewSpeaker, Speaker, UpdateSpeaker};
pub use transcript_segment::{NewTranscriptSegment, TranscriptSegment, UpdateTranscriptSegment};
pub use user::{NewUser, UpdateUser, User};
pub use voice_sample::{NewVoiceSample, VoiceSample};

// Common response types for Tauri commands
use serde::Serialize;

/// Generic API response wrapper
#[derive(Debug, Serialize)]
pub struct ApiResponse<T: Serialize> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn ok(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn err(message: &str) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(message.to_string()),
        }
    }
}
