#!/usr/bin/env python3
"""build.py — zero-dependency static build for muhyo.uz

Scans posts/*.html (skip files starting with _) and regenerates, in place:
  1. the essay list (<ol id="essay-list">) in index.html and essays.html
  2. <item> entries in rss.xml
  3. <url> entries in sitemap.xml

Run after adding/removing a post:  python3 build.py
It fails loudly if a post is missing the bits RSS needs.
"""

import html
import re
import sys
import xml.sax.saxutils as sax
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
BASE = "https://muhyo.uz"


def die(msg: str) -> None:
    print(f"build.py: error: {msg}", file=sys.stderr)
    sys.exit(1)


def parse_post(path: Path):
    src = path.read_text(encoding="utf-8")
    title = re.search(r"<title>(.*?)</title>", src, re.S)
    if not title:
        die(f"{path.name}: missing <title>")
    title = title.group(1).split(" — ")[0].strip()

    desc = re.search(r'<meta name="description" content="([^"]+)"', src)
    if not desc:
        die(f"{path.name}: missing <meta name=\"description\">")

    dt = re.search(r'<time datetime="(\d{4}-\d{2}-\d{2})"', src)
    if not dt:
        die(f"{path.name}: missing <time datetime=\"YYYY-MM-DD\">")
    try:
        d = date.fromisoformat(dt.group(1))
    except ValueError:
        die(f"{path.name}: bad date {dt.group(1)}")

    return {"slug": path.stem, "title": title, "desc": desc.group(1), "date": d}


def list_item(p) -> str:
    return (
        f'  <li><a href="posts/{p["slug"]}.html">\n'
        f'    <time class="essay-date" datetime="{p["date"].isoformat()}">'
        f'{p["date"].strftime("%d %b %Y")}</time>\n'
        f'    <span class="essay-title">{html.escape(p["title"])}</span>\n'
        f'    <span class="essay-arrow" aria-hidden="true"><svg viewBox="0 0 24 24">'
        f'<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
        f'stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg></span>\n'
        f'  </a></li>'
    )


def rss_item(p) -> str:
    pub = p["date"].strftime("%a, %d %b %Y 00:00:00 +0000")
    url = f'{BASE}/posts/{p["slug"]}.html'
    return (
        f'    <item>\n'
        f'      <title>{sax.escape(p["title"])}</title>\n'
        f'      <link>{url}</link>\n'
        f'      <guid isPermaLink="true">{url}</guid>\n'
        f'      <description>{sax.escape(p["desc"])}</description>\n'
        f'      <pubDate>{pub}</pubDate>\n'
        f'    </item>'
    )


def sitemap_url(p) -> str:
    return (
        f'  <url>\n'
        f'    <loc>{BASE}/posts/{p["slug"]}.html</loc>\n'
        f'    <lastmod>{p["date"].isoformat()}</lastmod>\n'
        f'    <changefreq>yearly</changefreq>\n'
        f'    <priority>0.6</priority>\n'
        f'  </url>'
    )


def splice(path: Path, start_marker: str, end_marker: str, body: str) -> None:
    src = path.read_text(encoding="utf-8")
    pat = re.compile(re.escape(start_marker) + r'.*?' + re.escape(end_marker), re.S)
    replacement = f'{start_marker}\n{body}\n    {end_marker}'
    new, n = pat.subn(replacement, src, count=1)
    if n != 1:
        die(f'{path.name}: marker pair {start_marker!r}…{end_marker!r} not found exactly once')
    path.write_text(new, encoding="utf-8")


def main() -> None:
    posts_dir = ROOT / "posts"
    posts = []
    if posts_dir.is_dir():
        for f in sorted(posts_dir.glob("*.html")):
            if f.name.startswith("_"):
                continue
            posts.append(parse_post(f))
    posts.sort(key=lambda p: p["date"], reverse=True)

    items = "\n".join(list_item(p) for p in posts)
    for page in ("index.html", "essays.html"):
        splice(ROOT / page,
               '<!-- ESSAYS_START — build.py regenerates -->',
               '</ol>',
               items)

    rss_items = "\n".join(rss_item(p) for p in posts)
    splice(ROOT / "rss.xml",
           '<!-- ESSAYS_START — build.py regenerates items -->',
           '<!-- ESSAYS_END -->',
           rss_items)

    urls = "\n".join(sitemap_url(p) for p in posts)
    splice(ROOT / "sitemap.xml",
           '<!-- ESSAYS_START — build.py regenerates post URLs -->',
           '<!-- ESSAYS_END -->',
           urls)

    print(f"build.py: {len(posts)} post(s) → index.html, essays.html, rss.xml, sitemap.xml")


if __name__ == "__main__":
    main()
