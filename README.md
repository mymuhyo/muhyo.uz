# muhyo.uz — MuhYo

[![verify](https://github.com/mymuhyo/muhyo.uz/actions/workflows/verify.yml/badge.svg)](https://github.com/mymuhyo/muhyo.uz/actions/workflows/verify.yml)

Personal site of **Muhammadyokub Yusuf (MuhYo)** — essays on learning AI, in public.
Static HTML/CSS, zero JavaScript, self-hosted fonts, no trackers, no cookies.

Live at <https://muhyo.uz> (not yet deployed — see *Deploy*).

## Layout

```
index.html         Landing page (LEDGER direction — see DESIGN.md)
essays.html        Essay archive (honest empty state until posts exist)
404.html           Custom not-found page (noindex), same chrome
posts/             Essays live here; _template.html is the starting point
assets/            Fonts (woff2, self-hosted), halftone portrait, icons, OG image
humans.txt         Who/how — no trackers, by hand
build.py           Zero-dependency regenerator: essay list + RSS + sitemap
styles.css         Design tokens + styles (light "Paper" / dark "Midnight")
DESIGN.md          The design contract: direction, tokens, bans, verification bar
```

## Publishing an essay

1. `cp posts/_template.html posts/my-essay.html`
2. Fill in: `<title>`, `meta description`, `<time datetime="YYYY-MM-DD">`, the `<h1>`, the body.
3. `python3 build.py` — regenerates the essay lists in `index.html` / `essays.html`, `rss.xml`, `sitemap.xml`. Fails loudly if required metadata is missing.
4. Deploy.

Once at least one essay exists, the "first drafts in progress" block hides itself (`.essay-list:has(li) + .essays-empty { display: none }`).

## Deploy

Any static host works — GitHub Pages, Cloudflare Pages, Netlify, or plain nginx/rsync.
Everything is relative paths; serve the folder root at `muhyo.uz/`. Point the apex + `www` at the host, keep HTTPS, and the absolute URLs in `rss.xml` / `sitemap.xml` / Open Graph tags (`https://muhyo.uz/…`) stay correct.

## Assets & licenses

- **Newsreader** (display & text) — SIL OFL, <https://fonts.google.com/specimen/Newsreader>, self-hosted under `assets/fonts/`
- **JetBrains Mono** (meta & labels) — SIL OFL, self-hosted under `assets/fonts/`
- UI glyphs — simple-icons (CC0), baked inline as `currentColor`
- Portrait — generated halftone from the author's own photo (`assets/portrait-dots-*.svg`), not a stock image
- OG image — generated (`assets/og-image.png`)
- Wordmark is typographic ("MuhYo."). The owner's glossy badge logo is intentionally not used on-site (see DESIGN.md §2); it remains his to use elsewhere.

## Verification

See **VERIFICATION.md** for the full audit: every gate, its numbers, the Vercel Web
Interface Guidelines findings, and the honest limitations. Reproduce locally:

```sh
npm ci                                   # pins puppeteer-core + axe-core
python3 -m http.server 8137 &            # serve the folder
CHROME_PATH=$(find .firecrawl/browsers -name chrome-headless-shell -type f) \
  node tools/verify.mjs /                # screenshots + axe + LCP/CLS
# (also: /essays.html and /404.html — npm run verify:essays, npm run verify:404)
npx lighthouse http://127.0.0.1:8137/ --chrome-path="$CHROME_PATH"
```

`.github/workflows/verify.yml` runs the same gates on every push: `build.py`
idempotence (generated files must match), real-browser verification of `/`,
`/essays.html`, `/404.html`, and W3C Nu validation of the four HTML entry points.

Chrome for Testing is fetched via `npx @puppeteer/browsers install chrome-headless-shell@stable --path .firecrawl/browsers`.

## Open dependencies (owner action)

1. **Starter essays** — first essays are being written; until one is approved and published, the archive shows the designed empty state. This is deliberate, not a bug.
2. **LinkedIn URL** — `https://www.linkedin.com/in/muhyo` is a guess from the handle `@muhyo`; verify or replace in `index.html` / `essays.html`.
3. **Deploy + DNS** for `muhyo.uz` is not yet done.
4. **Firecrawl** was blocked from this machine (no API key from this IP); the reference `brianan.ca` was analyzed via direct fetch + local mirror instead. See DESIGN.md §2.
5. **Verify workflow** — `.github/workflows/verify.yml` is present in this repo's history preparation but can't be pushed with the current OAuth token (no `workflow` scope). Run `gh auth refresh -h github.com -s workflow` (approve in the browser), then `git add .github/workflows/verify.yml && git commit -m "ci: verify workflow" && git push` — or paste the file in via the web editor. Until then the badge above shows no status and CI gates are enforced only locally (see above).

## License

Code, styles and build tooling: [MIT](LICENSE). Essays, the portrait, OG image and the MuhYo wordmark: © Muhammadyokub Yusuf, all rights reserved — quoting with attribution is fine.
