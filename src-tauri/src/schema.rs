// @generated automatically by Diesel CLI.

diesel::table! {
    activity_logs (id) {
        id -> Integer,
        user_id -> Nullable<Integer>,
        action -> Text,
        target_type -> Text,
        target_id -> Nullable<Integer>,
        details -> Nullable<Text>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    alert_words (id) {
        id -> Integer,
        keyword -> Text,
        category -> Text,
        description -> Nullable<Text>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    audio_files (id) {
        id -> Integer,
        case_id -> Integer,
        file_name -> Text,
        file_path -> Text,
        duration -> Float,
        status -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    cases (id) {
        id -> Integer,
        code -> Text,
        title -> Text,
        description -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    notifications (id) {
        id -> Integer,
        notification_type -> Text,
        action -> Text,
        title -> Text,
        message -> Nullable<Text>,
        entity_type -> Nullable<Text>,
        entity_id -> Nullable<Integer>,
        is_read -> Integer,
        is_important -> Integer,
        created_at -> Timestamp,
    }
}

diesel::table! {
    replacement_words (id) {
        id -> Integer,
        original -> Text,
        correct -> Text,
        category -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    speakers (id) {
        id -> Integer,
        name -> Text,
        alias -> Nullable<Text>,
        gender -> Nullable<Text>,
        age_estimate -> Nullable<Text>,
        notes -> Nullable<Text>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    transcript_segments (id) {
        id -> Integer,
        audio_file_id -> Integer,
        speaker_id -> Nullable<Integer>,
        start_time -> Float,
        end_time -> Float,
        text -> Text,
        is_deleted -> Integer,
        created_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        name -> Text,
        email -> Text,
        role -> Text,
        avatar -> Nullable<Text>,
        username -> Text,
        password_hash -> Text,
        is_active -> Integer,
        created_at -> Timestamp,
    }
}

diesel::table! {
    voice_samples (id) {
        id -> Integer,
        speaker_id -> Integer,
        file_name -> Text,
        file_path -> Text,
        duration -> Float,
        created_at -> Timestamp,
    }
}

diesel::joinable!(activity_logs -> users (user_id));
diesel::joinable!(audio_files -> cases (case_id));
diesel::joinable!(transcript_segments -> audio_files (audio_file_id));
diesel::joinable!(transcript_segments -> speakers (speaker_id));
diesel::joinable!(voice_samples -> speakers (speaker_id));

diesel::allow_tables_to_appear_in_same_query!(
    activity_logs,
    alert_words,
    audio_files,
    cases,
    notifications,
    replacement_words,
    speakers,
    transcript_segments,
    users,
    voice_samples,
);
