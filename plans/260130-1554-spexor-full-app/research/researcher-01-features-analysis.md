# Research: SPEXOR Features Analysis

## Tổng quan dự án

SPEXOR là ứng dụng **Audio to Text Investigation** - công cụ điều tra dựa trên phân tích audio, transcription, và nhận dạng người nói.

## Core Features (từ Function_List_UserFlow.md)

### 1. Case Management (Quản lý sự vụ)
- CRUD sự vụ (tạo, xem, sửa, xóa)
- Workspace để làm việc với sự vụ
- Upload và quản lý audio files
- Gán người phụ trách
- Export Word/PDF

### 2. Audio & Transcript
- Upload audio files (wav, mp3, m4a, flac)
- Transcription với AI (Whisper)
- Phát hiện và highlight từ khóa cảnh báo
- Xóa/khôi phục segments
- Audio player với waveform visualization
- Jump to time từ transcript

### 3. Speaker Management (Người nói)
- CRUD người nói
- Upload voice samples để nhận dạng
- Gán speaker cho transcript segments
- Speaker diarization tự động

### 4. Alert Words (Từ khóa cảnh báo)
- CRUD từ khóa theo danh mục
- Danh mục: Tài chính, Bạo lực, Ma túy, Khác
- Import/Export từ khóa

### 5. Replacement Words (Từ thay thế)
- Tự động sửa lỗi transcription
- Mapping từ gốc → từ đúng
- Phân loại theo danh mục

### 6. User Management
- CRUD người dùng
- Phân quyền: Admin, Điều tra viên, Người xem
- Quản lý authentication

### 7. AI Summary
- 3 mức độ: Ngắn, Trung bình, Chi tiết
- Tóm tắt chủ đề, ý chính
- Copy to clipboard

### 8. Notifications
- Lọc theo loại và ngày tháng
- Cấu hình sự kiện quan trọng
- Đánh dấu đã đọc

### 9. Activity Logs
- Nhật ký hoạt động hệ thống
- Lọc theo hành động, ngày
- Export logs

### 10. Dashboard
- Thống kê tổng quan
- Charts: Bar, Donut, Monthly
- Hoạt động gần đây

## Data Entities

| Entity | Fields |
|--------|--------|
| Case | id, code, title, description, assignees, audioFiles, alerts, createdAt |
| AudioFile | id, caseId, fileName, duration, status, transcriptSegments |
| TranscriptSegment | id, audioFileId, startTime, endTime, speakerId, text |
| Speaker | id, name, alias, gender, age, voiceSamples, notes |
| AlertWord | id, keyword, category, description |
| ReplacementWord | id, original, correct, category |
| User | id, name, email, role, avatar |
| Notification | id, type, action, title, message, timestamp, isRead, isImportant |
| ActivityLog | id, userId, action, target, details, timestamp |

## UI Pages (từ index.html)

1. Dashboard
2. Cases (list + workspace)
3. Users
4. Speakers
5. Alert Words
6. Replacement Words
7. Logs
8. Notifications
9. Support
