---
description: ⚡ Load and apply a skill from .gemini/skills
argument-hint: <skill-name> [task description]
---

# Use Skill Workflow

Apply a specific skill to complete a task.

<arguments>$ARGUMENTS</arguments>

---

## Instructions

1. **Parse Arguments**
   - Extract the skill name (first word)
   - Extract the task description (remaining words, optional)

2. **Load the Skill**
   - Read the `SKILL.md` file from `.gemini/skills/<skill-name>/SKILL.md`
   - If skill not found, list available skills from `.gemini/skills/` and ask user to choose

3. **Understand the Skill**
   - Parse the YAML frontmatter for metadata (name, description, allowed-tools)
   - Read the markdown body for instructions, guidelines, and examples
   - Check if skill has `references/` folder for additional documentation
   - Check if skill has `scripts/` folder for executable scripts

4. **Apply the Skill**
   - Follow the instructions in the skill's markdown body
   - If there are scripts, check their requirements (dependencies, env vars)
   - Execute the task using the skill's guidelines

5. **Report**
   - Summarize what was done using the skill
   - Provide any outputs or artifacts generated

---

## Available Skills

Run this command without arguments to see all available skills:
```
/use-skill
```

## Examples

```
/use-skill ai-multimodal analyze this screenshot
/use-skill ui-ux-pro-max design a modern dashboard
/use-skill debugging fix the login issue
/use-skill frontend-development create a responsive navbar
/use-skill code-review review the utils.ts file
```
