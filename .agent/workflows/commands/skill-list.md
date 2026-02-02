---
description: 📚 List all available skills from .gemini/skills
---

# List Available Skills

Display all skills available in the `.gemini/skills` directory.

---

## Instructions

1. **Scan skills directory**
   - List all folders in `.gemini/skills/` that contain a `SKILL.md` file
   
2. **For each skill, extract:**
   - Skill name (from folder name or YAML `name` field)
   - Description (from YAML `description` field)
   - Has scripts? (check for `scripts/` folder)
   - Has references? (check for `references/` folder)

3. **Output as formatted table**

---

## Quick Reference

| Skill | Description |
|-------|-------------|
| `ai-artist` | Create artwork and visual art |
| `ai-multimodal` | Process audio/video/images with Gemini API |
| `backend-development` | Backend development guidelines |
| `better-auth` | Authentication implementation |
| `brainstorming` | Brainstorming techniques |
| `chrome-devtools` | Chrome DevTools usage |
| `code-review` | Code review practices |
| `context-engineering` | Context/prompt engineering |
| `databases` | Database management |
| `debugging` | Debugging techniques |
| `devops` | DevOps & deployment |
| `docs-seeker` | Documentation search |
| `frontend-development` | Frontend development guidelines |
| `google-adk-python` | Google ADK Python SDK |
| `markdown-novel-viewer` | Novel viewer component |
| `mcp-builder` | Build MCP servers |
| `mcp-management` | MCP server management |
| `media-processing` | Media file processing |
| `mermaidjs-v11` | Mermaid.js diagrams |
| `mobile-development` | Mobile app development |
| `payment-integration` | Payment gateway integration |
| `planning` | Project planning |
| `plans-kanban` | Kanban board for plans |
| `problem-solving` | Problem solving techniques |
| `repomix` | Repository analysis |
| `research` | Research techniques |
| `sequential-thinking` | Sequential thinking patterns |
| `shopify` | Shopify development |
| `template-skill` | Template for new skills |
| `threejs` | Three.js 3D development |
| `ui-styling` | UI styling guidelines |
| `ui-ux-pro-max` | Advanced UI/UX design |
| `web-frameworks` | Web framework guides |

### Document Skills (sub-skills)
| Skill | Description |
|-------|-------------|
| `document-skills/docx` | Word document manipulation |
| `document-skills/pdf` | PDF processing |
| `document-skills/pptx` | PowerPoint manipulation |
| `document-skills/xlsx` | Excel spreadsheet processing |

---

## Usage

To use a skill:
```
/use-skill <skill-name> [task description]
```

Examples:
```
/use-skill ai-multimodal analyze this image
/use-skill debugging fix the login error
/use-skill ui-ux-pro-max design a dashboard
```
