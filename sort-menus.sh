#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

python3 - <<'PY'
import json
import unicodedata
from pathlib import Path

menu_path = Path('data/menus.json')
menu = json.loads(menu_path.read_text(encoding='utf-8'))

def strip_accents(text: str) -> str:
    normalized = unicodedata.normalize('NFKD', text)
    return ''.join(ch for ch in normalized if not unicodedata.combining(ch))

def sort_key(text: str):
    return (strip_accents(text), text)

def sort_list(value):
    if all(isinstance(item, str) for item in value):
        return sorted(value, key=sort_key)
    if all(isinstance(item, dict) for item in value):
        return sorted(value, key=lambda item: sort_key(item.get('nombre', '')))
    return value

for key, value in menu.items():
    if isinstance(value, list):
        menu[key] = sort_list(value)

menu_path.write_text(json.dumps(menu, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
PY

echo "menus.json ordenado."
