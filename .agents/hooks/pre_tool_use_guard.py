#!/usr/bin/env python3
import json
import sys


def deny(reason: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))


payload = json.load(sys.stdin)
tool_input = payload.get("tool_input") or {}

command = ""
if isinstance(tool_input, dict):
    command = str(tool_input.get("command") or tool_input.get("cmd") or tool_input)
else:
    command = str(tool_input)

normalized = command.replace("\\", "/")

if ".claude/" in normalized or normalized.endswith(".claude") or " .claude" in normalized:
    deny("Project guardrail: do not touch .claude/.")
    sys.exit(0)

sys.exit(0)
