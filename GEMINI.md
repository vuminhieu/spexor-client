# GEMINI.md

This file provides guidance to Antigravity (Gemini AI) when working with code in any repository.

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

- Primary workflow: `./.agent/workflows/workflows/primary-workflow.md`
- Development rules: `./.agent/workflows/workflows/development-rules.md`
- Orchestration protocols: `./.agent/workflows/workflows/orchestration-protocol.md`
- Documentation management: `./.agent/workflows/workflows/documentation-management.md`
- Antigravity rules: `./.agent/workflows/ANTIGRAVITY_RULES.md`
- And other workflows: `./.agent/workflows/workflows/*`
- Commands: `./.agent/workflows/commands/*`

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** You must follow strictly the development rules in `./.agent/workflows/workflows/development-rules.md` file.
**IMPORTANT:** Before you plan or proceed any implementation, always read the `./README.md` file first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

## Python Scripts (Skills)

When running Python scripts from `~/.gemini/skills/`, use the venv Python interpreter:
- **Linux/macOS:** `~/.gemini/skills/.venv/bin/python3 scripts/xxx.py`
- **Windows:** `$env:USERPROFILE\.gemini\skills\.venv\Scripts\python.exe scripts/xxx.py`

This ensures packages installed by `install.sh` (google-genai, pypdf, etc.) are available.

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them, structure like below:

```
./docs
 project-overview-pdr.md
 code-standards.md
 codebase-summary.md
 design-guidelines.md
 deployment-guide.md
 system-architecture.md
 project-roadmap.md
```

## Skills & Commands

Skills are located in:
- Project-specific: `./.agent/skills/`
- Global: `~/.gemini/skills/`

Commands are located in:
- Project-specific: `./.agent/workflows/commands/`
- Use `/command-name` syntax to invoke commands

## Global Configuration

- MCP Config: `~/.gemini/antigravity/mcp_config.json`
- Global Skills: `~/.gemini/skills/`
- This GEMINI.md file: `~/.gemini/GEMINI.md`

## Global .agent Directory

The global `.agent` directory is located at `~/.gemini/.agent/` with the following structure:

```
~/.gemini/.agent/
 agents/           # 17 agent definition files
 commands/         # 73 command files  
 hooks/            # 53 hook scripts
 output-styles/    # 6 output style configs
 plugins/          # 309 plugin files
 scripts/          # 17 utility scripts
 skills/           # Skills index (main skills at ~/.gemini/skills/)
 workflows/        # 81 workflow files
    ANTIGRAVITY_RULES.md
    commands/
       *.md (76 command files)
 .ck.json          # Claude Kit config
 .ckignore         # Ignore patterns
 .env.example      # Environment template
 .mcp.json.example # MCP config template
 metadata.json     # Metadata
 settings.json     # Settings
 statusline.*      # Statusline scripts (cjs, ps1, sh)
```

**Path Resolution:**
- `~` expands to user home directory on all platforms
- Windows: `%USERPROFILE%` or `$env:USERPROFILE` (PowerShell)
- Linux/macOS: `$HOME` or `~`

**Fallback Behavior:**
- If a project has its own `.agent` folder, use project-specific configurations first
- If project doesn't have `.agent`, fallback to global `~/.gemini/.agent/`
- Skills from both locations are merged and available

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./GEMINI.md` or this global `GEMINI.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*
