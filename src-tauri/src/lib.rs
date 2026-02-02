//! SPEXOR Client - Tauri Application Library
//!
//! Audio investigation tool with case management, transcription,
//! speaker recognition, and alert word detection.

mod commands;
mod models;
mod schema;
mod services;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize database
            let app_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data dir");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app data dir");

            services::init_db(&app_dir).expect("Failed to initialize database");

            // Manage DbPool in Tauri state for commands that use State<DbPool>
            let pool = services::get_pool().clone();
            app.manage(pool);

            println!("SPEXOR Client started successfully");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Greet (demo)
            commands::greet::greet,
            commands::greet::greet_async,
            // Auth
            commands::auth::login,
            commands::auth::logout,
            commands::auth::get_current_user,
            commands::auth::change_password,
            // Cases
            commands::get_cases,
            commands::get_case,
            commands::create_case,
            commands::update_case,
            commands::delete_case,
            // Audio files
            commands::get_audio_files,
            commands::get_audio_file,
            commands::upload_audio,
            commands::update_audio_file,
            commands::delete_audio_file,
            // Transcript segments
            commands::get_transcript_segments,
            commands::create_transcript_segment,
            commands::update_transcript_segment,
            commands::delete_transcript_segment,
            commands::bulk_create_segments,
            // Speakers
            commands::get_speakers,
            commands::get_speaker,
            commands::create_speaker,
            commands::update_speaker,
            commands::delete_speaker,
            commands::get_voice_samples,
            commands::create_voice_sample,
            commands::delete_voice_sample,
            // Vocabulary
            commands::get_alert_words,
            commands::get_alert_words_by_category,
            commands::create_alert_word,
            commands::delete_alert_word,
            commands::get_replacement_words,
            commands::create_replacement_word,
            commands::delete_replacement_word,
            // Users
            commands::get_users,
            commands::get_user,
            commands::create_user,
            commands::update_user,
            commands::delete_user,
            // Notifications
            commands::get_notifications,
            commands::get_unread_count,
            commands::create_notification,
            commands::update_notification,
            commands::mark_all_notifications_read,
            commands::delete_notification,
            // Activity logs
            commands::get_activity_logs,
            commands::get_activity_logs_by_action,
            commands::create_activity_log,
            commands::cleanup_old_logs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
