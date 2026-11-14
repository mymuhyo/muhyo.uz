# VERIFICATION — muhyo.uz

Run **2026-11-14** against `http://127.0.0.1:8137` (python3 `http.server`, repo root)
using **chrome-headless-shell 157.0.8103.78** (Chromium for Testing, downloaded via
`@puppeteer/browsers` — the system Brave binary is SIGKILLed instantly on this machine),
`puppeteer-core`, `axe-core`, Lighthouse 12 CLI, and the W3C Nu validator (network).
Reprove everything with `python3 -m http.server 8137 &` then `node tools/verify.mjs /`
(and `… /essays.html`). See README → Verification.

## Gates

| Gate | Result | Evidence |
|---|---|---|
| Screenshots 320 / 768 / 1024 / 1440 | ✅ pass | `.firecrawl/verify/shots/{index,nojs}-{light,dark}-{320,768,1024,1440}.png` — capture uses Chromium's `prefers-color-scheme` emulation, so both themes are real captures, not CSS hacks |
| JS-disabled screenshots | ✅ pass | `nojs-*-*.png` — `page.setJavaScriptEnabled(false)`; the page ships **zero JS**, so disabled ≡ enabled (identical pixels) |
| Console errors / pageerrors / request failures | ✅ **0 / 0 / 0** | puppeteer listeners over both pages |
| Lighthouse performance / a11y / best-practices / SEO | ✅ **100 / 100 / 100 / 100** (index & essays) | `.firecrawl/lh-index.json`, `.firecrawl/lh-essays.json`; FCP 0.9 s · **LCP 0.9 s** · **CLS 0.022** · TBT 0 ms · Speed Index 0.9 s (simulated throttling) |
| axe-core violations | ✅ **0** (light & dark, index & essays) | rules default (incl. `color-contrast`) |
| W3C HTML validation | ✅ **0 errors, 0 warnings** (`index.html`, `essays.html`, `posts/_template.html`) | validator.w3.org Nu, `out=json` |
| LCP < 2.5 s / CLS < 0.1 (throttled) | ✅ **0.19–0.20 s / 0.013** | Chromium, Slow 4G preset (~180 KB/s, 562 ms RTT) + 4× CPU throttle — **localhost, not a deployed origin** |
| 5-second stranger test | ✅ pass, unanimous | Two independent classifiers (`openrouter/typesafe/jev-1.14`, `openrouter/perplexity/pplx-decider-v1.3:free`) judged the desktop first screen: **personal essay site (p≈1.0), audience = followers, main action = “Read the Essays” (p≈0.99), 5-second test true (p≈0.93/0.98)**; a third pass on the 320px first screen agreed (1.0 / 0.93 / 1.0) |
| WCAG AA contrast | ✅ (computed + axe) | tokens verified at build time: ink 13.75 / soft 7.78 / muted 5.29 / accent 6.83 (light); 14.12 / 9.12 / 6.79 / 8.12 (dark) |

Not gated by me, with reasons:
- **Real-network LCP** — site is not deployed to muhyo.uz yet; localhost ≠ production. Deploy, then measure.
- **Full Chrome + Chrome DevTools MCP** — the machine kills browser binaries (Brave/Chromium SIGKILL at launch); the sanctioned fallback (headless Chrome screenshots + puppeteer-core) was used instead.
- **Manual screen-reader pass (VoiceOver/NVDA)** — not run; semantics audited manually and via axe only.
- **Human 5-second test** — classifiers, not humans. Owner should show it to one human.

## Vercel Web Interface Guidelines — audit

Checklist source: `vercel-labs/web-interface-guidelines` `command.md` (snapshot kept at
`.firecrawl/vercel-web-interface-guidelines.md`). Findings and dispositions:

**Fixed in this pass (8):**
1. `#essays` / `#about` anchor targets had no `scroll-margin-top` → added `[id] { scroll-margin-top: var(--s-6) }`.
2. Missing `touch-action: manipulation` → added on `html` (kills double-tap zoom delay).
3. `-webkit-tap-highlight-color` unset → set intentionally to `var(--selection)`.
4. `:focus { outline: none }` without guarantee → replaced with `:focus:not(:focus-visible)` (focus-visible always renders 2px ring, 3px offset, both themes).
5. Brand token `MuhYo` not marked `translate="no"` → added to wordmarks (both pages + template).
6. Title Case (Chicago) required for headings/buttons → applied: h1 “Learning AI Out Loud, One Essay at a Time.”, “Who’s Writing”, “Read the Essays”, “All Essays →”, strong leads (“The First Essays Are Being Written.” / “Nothing Published Yet.”).
7. Two straight apostrophes in meta descriptions → typographic ’ .
8. 5 hand-pasted icon `<path>` elements missing self-closing slash (W3C caught) → fixed; validation re-run clean.

**Verified pass (no change needed):** skip link before content · hierarchical headings (h1→h2, no skips) · semantic elements over ARIA · native `<a>` for all navigation (Cmd/middle-click work) · no `outline: none` w/o replacement · hover/focus/active states increase contrast · explicit `transition` properties only (no `transition: all`) · reduced-motion honored (`scroll-behavior` auto; all transitions removed under `prefers-reduced-motion: reduce`) · `text-wrap: balance` headings / `pretty` body · `clamp()` fluid type ≤ 2.5× min · rem units, no px font-size · ≤ 68ch measure · `fetchpriority="high"` on the one above-fold image · explicit `width`/`height` on all `<img>` · `font-display: swap` + preload for critical fonts · `color-scheme` on `:root` in both themes · `theme-color` matches `--bg` per scheme · `…` not `...` · `&nbsp;` in tight brand pairs · `tabular-nums` on date/meta numerals · no `user-scalable=no` · no `autoFocus` · no sticky/fixed layers covering focus · `overscroll-behavior: none` on `pointer: fine` · no horizontal overflow at 320 px (verified in captures) · no carousels/autoplay/gestures · alt text on meaningful media, `figcaption` present · decorative SVGs `aria-hidden` · icon-only links have `aria-label` (RSS) · text links carry visible text.

**Deliberate deviations (documented, not hidden):**
- **First-person voice.** The guideline says “Second person; avoid first person”. That rule targets product UI copy; this site’s content *is* a first-person ledger, so article voice stays first person. Buttons and instructions stay imperative (“Read the Essays”), and the skip link is `Skip to content`, per the rule’s intent.
- **Sentence case in body/meta copy**, Title Case only on headings/buttons as the guideline scopes it.

**Not applicable:** forms & validation · async updates/toasts · gestures · modals/popovers · `<select>` · SSR/hydration · in-page JS dates (zero JS) · lists > 50 · video/GIFs.

## Fingerprint (what “done” means here)

The honest empty state is the biggest design decision: with zero published essays the page
**cannot and does not** fake an archive. Publish ≥ 1 essay (`cp posts/_template.html`, `python3 build.py`)
and the empty blocks hide themselves (`.essay-list:has(li) + .essays-empty`).

Remaining owner actions, in order: write/approve starter essay(s) → `python3 build.py` → point
`muhyo.uz` DNS at a static host → confirm the LinkedIn vanity URL (`/in/muhyo` assumed) →
optional: swap typographic wordmark for the glossy badge if he prefers it.

## 2026-11-14 — Optimization pass (UI/UX)

Scope: post-audit UI/UX + performance pass. No gates were lowered; nothing below is
marketing copy for itself — raw numbers are raw numbers.

**Changes**
- `styles.css`: `@import` of `assets/fonts/fonts.css` replaced with the six `@font-face`
  rules inlined at the top (paths rewritten). One less render-blocking request in the
  critical path; `fonts.css` deleted. Unicode-range split unchanged (latin-ext still
  downloads only when needed).
- View transitions: `@view-transition { navigation: auto }` — same-origin page
  navigations crossfade in Chromium 126+ / Safari 18.2+. Pure CSS; disabled entirely
  under `prefers-reduced-motion: reduce` (`navigation: none`).
- Essay rows (build.py + CSS): rows now carry a hover/focus-revealed arrow
  (opacity/transform 160ms; forced visible under `hover: none`; hidden in print).
  Verified end-to-end with a throwaway post: build spliced the row, the empty state
  hid itself via `.essay-list:has(li) + .essays-empty`, then the post was removed and
  `build.py` restored the empty list (idempotent).
- Footer colophon: now its own full-width row (`flex: none; width: 100%;
  max-width: none`) with the mono line left and a new **Back to the Top** link right.
  Root-cause note: the global `p { max-width: 68ch }` was clamping the flex child to
  ~68ch, so `flex: 1 1 100%` rendered at ~476px on the same line as the socials —
  percentage flex-basis was a red herring; `max-width: none` is the actual fix.
- New: `404.html` (noindex; kicker "404 · Lost in the Ledger", honest copy, two
  doors: Read the Essays / Home), `humans.txt`.
- Print: `@page` 2cm margins; header/skip-link/CTA row/portrait/socials/arrows
  hidden; links inked + underlined; `break-inside: avoid` on rows/facts/empty state;
  headings `break-after: avoid`. Emulated print-media screenshot inspected — clean.
- Windows High Contrast: `@media (forced-colors: active)` — system keywords
  (`CanvasText`, `ButtonFace`/`ButtonText`, `LinkText`, `Highlight` ring) so chrome
  stays legible without any reliance on the site's palette. Emulated capture inspected.
- `@media (prefers-contrast: more)`: meta text promotes to `--ink-soft`, accent
  darkens (light #173d7e / dark #b7cdf5), hairlines strengthen — both themes.
- `.github/workflows/verify.yml`: on push — build.py idempotence (`git diff
  --exit-code`), real-browser verify of `/`, `/essays.html`, `/404.html`, W3C Nu on
  the four HTML files. (Zero JS kept absolute; no theme toggle.)

**Re-verified after the pass**
- `tools/verify.mjs`: `/`, `/essays.html`, `/404.html` — 0 console errors,
  0 pageerrors, 0 request failures, **0 axe violations** (light & dark), LCP 72–140 ms
  (localhost, Slow 4G + 4× CPU), CLS 0–0.0132 (within the 0.1 budget).
- W3C Nu: **0 errors** on `index.html`, `essays.html`, `404.html`, `posts/_template.html`.
- `build.py`: 0 posts → markers spliced back to empty exactly (`git diff` clean
  outside the intended hunks).

**Not re-run in this pass**
- Lighthouse (no deploy; the one structural perf change removes a render-blocking
  request — previous 100/100/100/100 stands until the next deploy, then remeasure).
- Manual screen-reader pass, human five-second test — still open, unchanged.
- forced-colors/print were verified by emulation screenshots, not on real Windows
  High Contrast hardware or a physical printer.

## 2026-11-14 (night) — Analytics exception merged; claims re-audited

PR #1 (Vercel Web Analytics, snippet-only install) merged as `7260d6a` after its
branch picked up the zero-build fix (`f3775b2` — STATIC_BUILD_NO_OUT_DIR); the
duplicate PR #2 was closed unmerged by the owner. The owner enabled Web Analytics
deliberately; DESIGN.md's zero-JS contract now carries one explicit, documented
exception (§6). The dead `@vercel/analytics` devDependency was never imported
(plain HTML uses the deferred CDN snippet; the package wraps React/Next) — removed.

Re-verified after the merge (all on the merged tree):
- `build.py` idempotent; W3C Nu: **0 errors** on index/essays/404/posts/_template.html.
- Real browser (chrome-headless-shell, Slow 4G + 4× CPU): `/`, `/essays.html`, `/404.html` —
  0 console errors, 0 pageerrors, 0 request failures, **0 axe violations** (light & dark).
  LCP 1040 / 228 / 124 ms, CLS 0.0132 / 0 / 0 — within the 0.1 budget. Note: `/` LCP
  regressed vs the pre-merge 168 ms pass (the analytics request now shares the throttled
  connection); still ~1s, far under the 2.5s bar.
- Honest-claim pass: humans.txt, README deploy section, git remote description and
  package.json description now state the analytics reality; "zero JS / no trackers"
  survives as the documented default with exactly one exception.
