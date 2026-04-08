#!/usr/bin/env python3
"""
Export presentation/index.html to a single multi-page PDF (one page per slide).

Requires:
  pip install -r export_pdf_requirements.txt
  python -m playwright install chromium

If `playwright` is not on PATH (common on Windows), always use `python -m playwright`.
"""

from __future__ import annotations

import argparse
import sys
import tempfile
from pathlib import Path


EXPORT_HIDE_UI_CSS = """
.progress-bar, .slide-counter, .nav-dots, .nav-arrow, #particles-canvas {
  display: none !important;
}
"""


def _file_uri(path: Path) -> str:
    return path.resolve().as_uri()


def main() -> int:
    parser = argparse.ArgumentParser(description="Export web slides to one PDF.")
    parser.add_argument(
        "--html",
        type=Path,
        default=Path(__file__).resolve().parent / "index.html",
        help="Path to index.html",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=Path(__file__).resolve().parent / "AnimeDoll-presentation.pdf",
        help="Output PDF path",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=3840,
        help="Viewport / PDF page width in CSS pixels (default 3840 ≈ 4K 16:9 width)",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=2160,
        help="Viewport / PDF page height in CSS pixels (default 2160)",
    )
    parser.add_argument(
        "--settle-ms",
        type=int,
        default=1400,
        help="Wait after each slide change for CSS transition + staggered animations (ms)",
    )
    parser.add_argument(
        "--initial-wait-ms",
        type=int,
        default=800,
        help="Wait after load before first capture (fonts / layout)",
    )
    parser.add_argument(
        "--no-hide-ui",
        action="store_true",
        help="Keep progress bar, dots, arrows, particles in the PDF",
    )
    args = parser.parse_args()

    html_path = args.html
    if not html_path.is_file():
        print(f"HTML not found: {html_path}", file=sys.stderr)
        return 1

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print(
            "Missing playwright. Install: pip install playwright && python -m playwright install chromium",
            file=sys.stderr,
        )
        return 1

    try:
        from pypdf import PdfMerger as PdfJoiner
    except ImportError:
        try:
            from pypdf import PdfWriter as PdfJoiner
        except ImportError:
            print("Missing pypdf. Install: pip install pypdf", file=sys.stderr)
            return 1

    url = _file_uri(html_path)
    w, h = args.width, args.height
    settle = args.settle_ms
    initial = args.initial_wait_ms

    total = 0
    with tempfile.TemporaryDirectory(prefix="slides_pdf_") as tmpdir_str:
        tmpdir = Path(tmpdir_str)
        part_paths: list[Path] = []
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": w, "height": h},
                device_scale_factor=1,
            )
            page = context.new_page()
            page.goto(url, wait_until="networkidle", timeout=120_000)
            if not args.no_hide_ui:
                page.add_style_tag(content=EXPORT_HIDE_UI_CSS)
            page.wait_for_timeout(initial)

            total = page.evaluate("() => document.querySelectorAll('.slide').length")
            if total < 1:
                print("No .slide elements found.", file=sys.stderr)
                browser.close()
                return 1

            for i in range(total):
                page.evaluate("(idx) => { goToSlide(idx); }", i)
                page.wait_for_timeout(settle)
                part = tmpdir / f"slide_{i:03d}.pdf"
                page.pdf(
                    path=str(part),
                    width=f"{w}px",
                    height=f"{h}px",
                    print_background=True,
                    margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                )
                part_paths.append(part)

            browser.close()

        merger = PdfJoiner()
        for part in part_paths:
            merger.append(str(part))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with args.output.open("wb") as out_f:
            merger.write(out_f)
        if hasattr(merger, "close"):
            merger.close()

    print(f"Wrote {args.output} ({total} pages, {w}×{h} px per page)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
