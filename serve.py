#!/usr/bin/env python3
import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MENU_FILE = BASE_DIR / "menus.json"


def is_valid_menu(payload):
    if not isinstance(payload, dict):
        return False
    return all(key in payload for key in ("entrada", "principal", "postre"))


class MenuHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/menus":
            self._send_menu()
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/menus":
            self.send_error(404, "Not Found")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(content_length).decode("utf-8")
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, "JSON invalido")
            return

        if not is_valid_menu(payload):
            self.send_error(400, "Estructura de menu invalida")
            return

        MENU_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(b"{\"ok\":true}")

    def _send_menu(self):
        if not MENU_FILE.exists():
            self.send_error(404, "menus.json no encontrado")
            return
        data = MENU_FILE.read_text(encoding="utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(data.encode("utf-8"))


def main():
    parser = argparse.ArgumentParser(description="Servidor local para MenuPers")
    parser.add_argument("--host", default="127.0.0.1", help="Host a bind")
    parser.add_argument("--port", type=int, default=5500, help="Puerto HTTP")
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), MenuHandler)
    print(f"Sirviendo en http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
