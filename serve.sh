#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

PORT=${1:-5500}
echo "URLs:"
echo "  http://127.0.0.1:${PORT}/index.html"
echo "  http://127.0.0.1:${PORT}/indexMenuPers.html"
echo "  http://127.0.0.1:${PORT}/menuDiario.html"
echo "  http://127.0.0.1:${PORT}/adminMenu.html"
python3 server/serve.py --port "$PORT"
