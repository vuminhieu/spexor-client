---
description: 🤖 Auto-detect and apply skills based on keywords in user request
trigger: always
---

# Auto-Skills Detection System

Automatically detect and load relevant skills based on keywords in user requests.

---

## Skill Detection Rules

When the user's request contains these keywords, automatically load the corresponding skill:

### 🎨 Visual & Media Skills

| Keywords | Skill | Action |
|----------|-------|--------|
| `image`, `screenshot`, `hình ảnh`, `analyze image`, `ảnh`, `phân tích ảnh`, `xem ảnh`, `nhận diện` | `ai-multimodal` | Load for image analysis |
| `video`, `clip`, `phân tích video`, `transcribe video` | `ai-multimodal` | Load for video processing |
| `audio`, `mp3`, `wav`, `transcribe`, `podcast`, `âm thanh` | `ai-multimodal` | Load for audio processing |
| `generate image`, `tạo ảnh`, `vẽ`, `create image`, `artwork` | `ai-multimodal` | Load for image generation |
| `3d`, `three.js`, `threejs`, `webgl`, `3D scene` | `threejs` | Load for 3D development |

### 💻 Development Skills

| Keywords | Skill | Action |
|----------|-------|--------|
| `debug`, `lỗi`, `error`, `bug`, `fix`, `sửa lỗi`, `không hoạt động`, `crash` | `debugging` | Load for debugging |
| `review code`, `code review`, `kiểm tra code`, `đánh giá code` | `code-review` | Load for code review |
| `frontend`, `react`, `vue`, `angular`, `css`, `html`, `giao diện` | `frontend-development` | Load for frontend |
| `backend`, `api`, `server`, `database query`, `endpoint` | `backend-development` | Load for backend |
| `database`, `sql`, `mongodb`, `postgres`, `mysql`, `cơ sở dữ liệu` | `databases` | Load for databases |
| `deploy`, `ci/cd`, `docker`, `kubernetes`, `hosting`, `triển khai` | `devops` | Load for devops |
| `mobile`, `react native`, `flutter`, `ios`, `android`, `app` | `mobile-development` | Load for mobile |

### 🎨 Design Skills  

| Keywords | Skill | Action |
|----------|-------|--------|
| `ui`, `ux`, `design`, `thiết kế`, `giao diện`, `layout`, `mockup`, `wireframe` | `ui-ux-pro-max` | Load for UI/UX design |
| `styling`, `css`, `tailwind`, `style`, `theme`, `color`, `màu sắc` | `ui-styling` | Load for styling |
| `diagram`, `mermaid`, `flowchart`, `sơ đồ`, `biểu đồ` | `mermaidjs-v11` | Load for diagrams |

### 📄 Document Skills

| Keywords | Skill | Action |
|----------|-------|--------|
| `word`, `docx`, `document`, `văn bản` | `document-skills/docx` | Load for Word docs |
| `pdf`, `extract pdf`, `đọc pdf` | `document-skills/pdf` | Load for PDF |
| `excel`, `xlsx`, `spreadsheet`, `bảng tính` | `document-skills/xlsx` | Load for Excel |
| `powerpoint`, `pptx`, `slide`, `presentation`, `trình bày` | `document-skills/pptx` | Load for PowerPoint |

### 🧠 Thinking Skills

| Keywords | Skill | Action |
|----------|-------|--------|
| `brainstorm`, `ý tưởng`, `idea`, `đề xuất` | `brainstorming` | Load for brainstorming |
| `plan`, `kế hoạch`, `roadmap`, `timeline` | `planning` | Load for planning |
| `research`, `nghiên cứu`, `tìm hiểu`, `khảo sát` | `research` | Load for research |
| `problem`, `solve`, `giải quyết`, `vấn đề` | `problem-solving` | Load for problem solving |

### 💳 Integration Skills

| Keywords | Skill | Action |
|----------|-------|--------|
| `payment`, `thanh toán`, `stripe`, `paypal` | `payment-integration` | Load for payment |
| `auth`, `login`, `đăng nhập`, `authentication`, `xác thực` | `better-auth` | Load for auth |
| `shopify`, `ecommerce`, `thương mại điện tử` | `shopify` | Load for Shopify |
| `mcp`, `model context protocol`, `mcp server` | `mcp-builder` | Load for MCP |

---

## Auto-Detection Process

When processing ANY user request:

1. **Scan Request**: Check if request contains any trigger keywords from the tables above
2. **Match Skills**: Identify all matching skills (can be multiple)
3. **Load Skills**: Read the SKILL.md file for each matched skill
4. **Apply Guidelines**: Follow the instructions and best practices from loaded skills
5. **Execute Task**: Complete the user's request using skill capabilities
6. **Report**: Mention which skills were auto-activated in the response

---

## Examples

**User says:** "Phân tích screenshot này và tìm lỗi UI"
- **Auto-detected skills:** `ai-multimodal` (screenshot), `debugging` (lỗi), `ui-ux-pro-max` (UI)
- **Action:** Load all 3 skills and apply their guidelines

**User says:** "Tạo Excel report cho dữ liệu sales"
- **Auto-detected skills:** `document-skills/xlsx` (Excel)
- **Action:** Load xlsx skill and follow its instructions

**User says:** "Debug tại sao API không trả về data"
- **Auto-detected skills:** `debugging` (debug), `backend-development` (API)
- **Action:** Load both skills and apply debugging + backend guidelines

---

## Priority Rules

When multiple skills match:
1. **Primary skill** = Most specific match (e.g., `xlsx` for Excel tasks)
2. **Supporting skills** = General matches (e.g., `debugging` for fixing issues)
3. Apply guidelines from all skills, prioritizing primary skill

---

## Skill Loading Command

To manually check which skills would auto-activate:
```
Những skill nào sẽ được kích hoạt cho task: [describe task]
```
