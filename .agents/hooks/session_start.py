#!/usr/bin/env python3
"""Короткая памятка в начало каждой сессии Codex.

Держать её короткой — смысл всей затеи: это текст, который платится контекстом
в каждой сессии. Всё подробное живёт в AGENTS.md, который агент читает сам.
"""
import json

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": (
            "Project guardrails: read AGENTS.md first. Keep changes narrowly scoped. "
            "Edit skills only in .agents/skills/ — .claude/skills/ symlinks to them. "
            "Tailwind v4 with semantic tokens only, never literal hex. "
            "A change must survive its Surfaces (six accents, both themes, motion off, "
            "both locales, print, the data-* filter contract). "
            "After deleting or renaming anything, rg its name across the repo and clean up. "
            "Avoid full builds by default."
        ),
    }
}))
