#!/usr/bin/env python3
"""Хард-баны для постов, проверенные машиной, а не памятью модели.

Три правила из AGENTS.md (раздел Posts) выполняются в `src/data/posts/**`:
нет длинных тире, нет буквы `ё`, нет написания `TatarVerse`. До этого хука
проверка жила строкой в скилле `tatarverse-posts` — то есть срабатывала,
только если модель вспомнит про неё и если скилл вообще подхватился.

Вешается на PostToolUse. Правку он не отменяет (её уже применили) — он
кладёт находки обратно в контекст, чтобы агент починил их до того, как
скажет «готово».
"""
import json
import re
import sys
from pathlib import Path

POSTS_DIR = "src/data/posts"

RULES = (
    ("длинное тире", re.compile(r"[—–]"), "только дефис `-`"),
    ("буква ё", re.compile(r"[ёЁ]"), "только `е`"),
    ("TatarVerse", re.compile(r"TatarVerse"), "`Tatarverse` или строчное `tatarverse`"),
)


def collect_paths(payload: dict) -> list[Path]:
    """Пути к постам из полезной нагрузки хука.

    Форма tool_input отличается у Edit/Write/MultiEdit и у apply_patch Codex,
    поэтому вместо разбора схемы ищем в сериализованной нагрузке любые пути,
    которые ведут в каталог постов. Не нашли — проверяем каталог целиком:
    файлов там десяток, это дешевле пропущенного нарушения.
    """
    blob = json.dumps(payload, ensure_ascii=False).replace("\\\\", "/")
    hits = {
        Path(match)
        for match in re.findall(rf"[\w./\-]*{re.escape(POSTS_DIR)}/[\w.\-]+\.mdx", blob)
    }
    existing = [p for p in hits if p.exists()]
    if existing:
        return sorted(existing)

    if POSTS_DIR in blob:
        return sorted(Path(POSTS_DIR).glob("*.mdx"))

    return []


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    findings = []
    for path in collect_paths(payload):
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except OSError:
            continue

        for number, line in enumerate(lines, start=1):
            for label, pattern, fix in RULES:
                if pattern.search(line):
                    findings.append(f"  {path}:{number} — {label}, нужно {fix}\n    {line.strip()[:110]}")

    if not findings:
        return 0

    report = (
        "Нарушены хард-баны для постов (AGENTS.md, раздел Posts). "
        "Почини до того, как отчитываться о готовности:\n" + "\n".join(findings[:20])
    )
    if len(findings) > 20:
        report += f"\n  …и ещё {len(findings) - 20}"

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": report,
        }
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
