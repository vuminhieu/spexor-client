---
name: skills-index
description: Index of all available skills in ~/.gemini/skills directory. Use /skill-list command to see all skills.
version: 1.0.0
---

# Skills Index

This directory contains skill utilities but NOT the actual skills.
Skills are located in: `~/.gemini/skills/`

## Skill Locations

| Location | Type | Description |
|----------|------|-------------|
| `~/.gemini/skills/*` | Global | All skill directories |
| `./.agent/skills/*` | Project | Project-specific skills |

## Path Resolution

- `~` = User home directory
- **Windows**: `%USERPROFILE%` or `$env:USERPROFILE`
- **Linux/macOS**: `$HOME` or `~`

## Available Skills

Use `/skill-list` command to see all available skills with descriptions.

## How to Use Skills

1. **Load skill**: Read the `SKILL.md` file in the skill directory
2. **Check references**: Load files from `references/` folder if needed
3. **Run scripts**: Execute scripts from `scripts/` folder

## Python Environment

For skills requiring Python, use the virtual environment:

### Windows (PowerShell)
```powershell
# Using environment variable (portable)
$env:USERPROFILE\.gemini\skills\.venv\Scripts\python.exe scripts/xxx.py

# Or activate the venv first
$env:USERPROFILE\.gemini\skills\.venv\Scripts\Activate.ps1
python scripts/xxx.py
```

### Linux/macOS
```bash
~/.gemini/skills/.venv/bin/python3 scripts/xxx.py

# Or activate first
source ~/.gemini/skills/.venv/bin/activate
python scripts/xxx.py
```

## Skill Structure

Each skill folder should contain:
- `SKILL.md` - Main skill documentation with frontmatter
- `references/` - Detailed reference documents
- `scripts/` - Executable scripts (Python/JS)
