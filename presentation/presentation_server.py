#!/usr/bin/env python3
"""
AnimeDoll 演示页本地静态服务（标准库 http.server）。

在 Cursor 中「运行 Python 文件」即启动；停止调试 / 关闭终端 / Ctrl+C 即结束进程。

默认: http://127.0.0.1:3750/
改端口: 编辑下方 PORT 常量。
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = 3750
ROOT = Path(__file__).resolve().parent


def main() -> None:
    index = ROOT / "index.html"
    if not index.is_file():
        print(f"错误: 未找到 {index}", file=sys.stderr)
        raise SystemExit(1)

    handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))

    try:
        httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    except OSError as e:
        print(f"无法绑定 127.0.0.1:{PORT} — {e}", file=sys.stderr)
        print("若端口已被占用，请结束占用进程或修改本文件中的 PORT。", file=sys.stderr)
        raise SystemExit(1)

    print(f"目录: {ROOT}")
    print(f"访问: http://127.0.0.1:{PORT}/")
    print("结束: 停止运行或 Ctrl+C")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
