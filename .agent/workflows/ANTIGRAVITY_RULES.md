---
description: Global rules and guidelines for Antigravity AI agent
---

# ANTIGRAVITY RULES

This file defines global rules and behaviors for Antigravity (Gemini AI) when working across any repository.

## Core Principles

1. **Read Context First**: Always read the project's `README.md` and `GEMINI.md` (if exists) before proceeding with any task.
2. **Follow Workflows**: Strictly follow the defined workflows in `./.agent/workflows/` or global `~/.gemini/.agent/workflows/`.
3. **Use Skills**: Activate and use appropriate skills from the skills catalog for specific tasks.
4. **Concise Reporting**: Sacrifice grammar for concision in reports. List unresolved questions at the end.

## Global Paths

- **Global Workflows**: `~/.gemini/.agent/workflows/`
- **Global Commands**: `~/.gemini/.agent/workflows/commands/`
- **Global Skills**: `~/.gemini/skills/`
- **MCP Config**: `~/.gemini/antigravity/mcp_config.json`
- **GEMINI.md**: `~/.gemini/GEMINI.md`

**Path Resolution:**
- `~` = User home directory (portable across all machines)
- Windows: `%USERPROFILE%` or `$env:USERPROFILE`
- Linux/macOS: `$HOME`

## Project-Specific Paths (Priority)

When a project has its own `.agent` folder, use project-specific paths:
- **Project Workflows**: `./.agent/workflows/`
- **Project Commands**: `./.agent/workflows/commands/`
- **Project Skills**: `./.agent/skills/`

## Execution Rules

1. **Project-First**: Always prioritize project-specific configurations over global ones.
2. **Fallback to Global**: If project doesn't have `.agent`, use global `~/.gemini/.agent/`.
3. **Merge Skills**: Combine both project and global skills catalogs when analyzing tasks.

## Python Scripts Execution

When running Python scripts from skills, use venv Python interpreter:

### Windows
```powershell
# Project-specific
.agent\skills\.venv\Scripts\python.exe scripts\xxx.py

# Global (use $env:USERPROFILE for portable path)
$env:USERPROFILE\.gemini\skills\.venv\Scripts\python.exe scripts\xxx.py
```

### Linux/macOS
```bash
# Project-specific
.agent/skills/.venv/bin/python3 scripts/xxx.py

# Global
~/.gemini/skills/.venv/bin/python3 scripts/xxx.py
```

## Command Patterns

Use `/command-name` syntax to invoke commands. Examples:
- `/fix-hard` - Deep debugging with all available tools
- `/code` - Implement code following best practices
- `/plan` - Create detailed implementation plan
- `/scout` - Research and explore codebase
- `/skill-list` - List all available skills

## Documentation

Keep all important docs in `./docs` folder:
- `project-overview-pdr.md`
- `code-standards.md`
- `codebase-summary.md`
- `design-guidelines.md`
- `deployment-guide.md`
- `system-architecture.md`
- `project-roadmap.md`

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all instructions in this file and GEMINI.md. NON-NEGOTIABLE. NO EXCEPTIONS.
