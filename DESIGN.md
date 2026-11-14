# MuhYo — Design Direction & Tokens

**muhyo.uz · Muhammadyokub Yusuf ("MuhYo", from *Muh* + *Yo*) · English-primary, Uzbek secondary (accents only, not translated chrome)**

This file is the design contract. Components follow it; they don't negotiate with it.

---

## 1. The brief (from interview, verbatim intent)

- **What it is:** MuhYo's personal corner of the internet — a home for essays, plus ways to follow the work. He is a CS/AI student learning in public. Essays cover personal experience and work-related learning.
- **Audience (one):** Followers — people who already know him or who find the blog via search ("if searching my blog maybe popup is better"). Not acquisition marketing; no popups, no capture forms.
- **Single action:** Read the essays.
- **Offer & proof:** Essays themselves. **Proof: none available.** No metrics, employers, press, or testimonials are listed or implied anywhere on the page — credibility is carried by specificity and craft, not invented trust signals.
- **Brand assets:** `muhyo.uz` domain; glossy 3D badge logo (`~/Pictures/MuhYo-logo.png`); "darker blue, professional, minimal"; socials — GitHub `@mymuhyo`, X `@muhyoyusuf`, LinkedIn `@muhyo`. No existing copy, no photo selected for web (one usable: `~/Pictures/my_face.jpg`, 2544×3392).
- **Content state:** zero essays published. First essays being written (interview answered (b) — starter essays, author-written/approved). **Until real essays exist, the page must not pretend they do.** The honest empty state is part of the direction.
- **Framework:** none. Static HTML/CSS, zero JS. Justification: content-first single page + tiny essays index; no interactivity justifies no runtime; maximizes LCP/CLS, guarantees JS-disabled parity, trivial long-term maintenance for a one-person site.

## 2. Raw material, and what it taught us

| Source | How gathered | Finding |
|---|---|---|
| `brianan.ca` (sole reference the owner supplied; "menimcha yetadi" = enough) | `firecrawl` **blocked from this IP without API key** — fell back to direct `curl` (shell network OK; browsers cannot reach the internet from this machine), text extraction of the HTML, CSS inspection, and a full-page offline mirror screenshotted via headless Firefox at 1440px (`.firecrawl/mirror/`, working artifacts kept out of git) | Warm paper background (#f5f3ed), warm charcoal ink (#252521), muted #6b6a61, hairline #deddd4, Geist Sans, one screen, no nav, generous negative space, halftone dot portrait, text links with offset underlines, footer of plain text links. Strengths to learn from: typography-led hierarchy, restraint, warmth. We do **not** copy its palette, portrait, or layout. |
| Vercel Web Interface Guidelines | `curl https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` → `.firecrawl/vercel-web-interface-guidelines.md` (committed reference) | Used as the audit checklist in the verification pass (a11y, focus, forms, motion, content, anti-patterns). |
| ui-ux-pro-max skill | `search.py --design-system` + `--domain typography` + `--domain landing` | Returned Swiss Modernism 2.0 / Newsreader+Roboto pairing / Content-First landing pattern. Adopted the *direction family* (editorial, grid, content-first), rejected Roboto (generic) and pink accent (clashes with darker-blue brief). |
| modern-web-guidance | `search` + `retrieve typography, improve-text-layout-and-legibility, motion` | `rem` units only, `clamp()` fluid type ≤2.5× min, `text-wrap: balance` on headings / `pretty` on body, line length ≤80ch, `prefers-reduced-motion` opt-in pattern, animate transform/opacity only. |
| frontend-ui-engineering skill | "Avoid the AI Aesthetic" table | Content-first layout, no purple gradients, no glass, no stock card grids, spacing scale discipline. |
| 21st.dev / shadcn MCPs | `search` (portfolio heroes — React/shadcn, declined, see §6) and `search_logo` (svgl returned no GitHub/X/LinkedIn marks; icons fetched from simple-icons, CC0) | No React components installed — static site, zero JS. Pulling a framework for three list sections would violate "justify any framework". |
| Logo | inspected `~/Pictures/MuhYo-logo.png` (512×512) | Glossy metallic 3D badge with blue swoosh. Does not sit inside an editorial minimal system without looking pasted on. Decision: **typographic wordmark** "MuhYo" set in Newsreader is the on-site identity; the badge is kept for avatar/press contexts. Not recolored, not edited, not used at 16px favicon size. Owner can override. |

## 3. Named direction — **"LEDGER"**

> A private commonplace ledger, set in type.
> Paper and ink, not screens and gradients. An engineer's reading room: warm paper, deep-navy ink, one cobalt accent borrowed from the logo, a serif built for long-form reading, and a mono for the marginalia — dates, kickers, coordinates.

- Editorial, not decorative. Every element is either type, rule (hairline), or the one image.
- **Signature move:** the portrait is a generated **halftone dot field** built from his own photo with the background removed (local `rembg`, `u2netp`) — face emerges from negative space, no wall/door noise. Dots sized by luminance, navy-on-paper / paper-on-navy, face emerges from transparency. Two SVGs: `assets/portrait-dots-light.svg`, `assets/portrait-dots-dark.svg` (selected via `<picture>` + `prefers-color-scheme`).
- **Signature restraint:** zero shadows, zero gradients (except none), zero glass, zero radius above 2px, zero icons except the three brand marks + RSS + arrow, zero stock imagery, zero illustrations.
- Honest by construction: without essays to list, the page says so — "The first essays are being written" — instead of shipping fake cards.

### Explicit anti-slop bans (and why)

| Banned tell | Status |
|---|---|
| Inter / Roboto / Open Sans / Poppins | Banned. Generic; adds nothing. Newsreader (display+text) + JetBrains Mono (meta) instead. |
| Purple→blue gradients | Banned. Also violates Vercel WIG ("Excessive gradients" class) and the brief itself ("blue darker, professional" — a gradient is not a color). |
| Glassmorphism / blur cards | Banned. Zero transparency surfaces; paper is opaque. |
| "Modern, clean, minimal" copy / "Welcome to my world" | Banned. Copy states concrete facts: name, what he learns, what an essay is about. |
| Stock illustrations / 3D blobs / abstract hero art | Banned. The single image is a halftone print of his face. |
| Testimonials, logos, metrics | Banned — none exist. Inventing any is fabrication. |
| Newsletter capture forms | Banned — no backend, no consent flow, not asked for ("more focus to blog"). |
| Lorem ipsum / fake essay cards | Banned. Empty state is designed and honest. |
| Emojis as icons | Banned — vector icons only (simple-icons CC0). |
| Carousels / autoplaying motion | Banned — nothing moves on load; no scroll hijacking (modern-web-guidance: default static). |

Justified exceptions: **dark theme** (owner likes "blue darker" — implemented as a true second theme, §5), **Newsreader italic** for one pull-line (it's the font doing its job).

## 4. Type

- **Display & body (text): Newsreader** (variable, `opsz` axis, Google Fonts, self-hosted woff2) — designed for long-form reading; high-contrast editorial serif; Uzbek-Latin coverage OK (Latin Extended; note: no Cyrillic/Arabic-script glyphs — Uzbek in Uzbek-Latin script only).
- **Meta & labels (UI): JetBrains Mono** — dates, kickers, section indices, RSS; gives the engineer's-notebook register and prevents "designer serif + designer sans" cliché.
- **Rejected:** Inter (banned tell), Playfair/Bodoni (too fashion-luxury for an engineer), Cormorant (too fragile at text sizes), all-sans Geist homage (would be the reference with palette swapped).

Type scale (fluid, `clamp()` — max ≤ 2.5× min; rem units only):

| Token | Value | Use |
|---|---|---|
| `--text-2xs` | 0.6875rem | micro labels (mono, +tracking) |
| `--text-xs` | 0.78125rem | meta/kicker (mono caps, .14em) |
| `--text-sm` | 0.875rem | nav, secondary |
| `--text-base` | 1.0625rem | body lede (Newsreader 18–19px feel via 17px + 1.65 lh) |
| `--text-md` | 1.25rem | h3 / essay titles |
| `--text-lg` | clamp(1.5rem, 1.15rem + 1.6vw, 2.125rem) | h2 / section heads |
| `--text-xl` | clamp(2.6rem, 1.35rem + 6vw, 4.5rem) | h1 hero (Newsreader opsz ~72) |

Headings: `text-wrap: balance`; body: `text-wrap: pretty`; line length capped 68ch; `font-variant-numeric: tabular-nums` on meta.

## 5. Color tokens (contrast-verified with WCAG formula; all text ≥ 4.5:1, large/UI ≥ 3:1)

### Light ("Paper")
| Token | Hex | Contrast on bg | Use |
|---|---|---|---|
| `--bg` | `#F4F0E6` | — | paper |
| `--ink` | `#17233C` | 13.75 | primary text |
| `--ink-soft` | `#3F4A63` | 7.78 | secondary text |
| `--muted` | `#59637A` | 5.29 | meta text |
| `--hairline` | `#D8D3C6` | 1.31 (decorative rules only — never text) | borders |
| `--accent` | `#1E4FA3` | 6.83 | links, CTA underline |
| `--accent-hover` | `#173D7E` | 9.20 | hover/focus |
| `--focus` | `#1E4FA3` | — | 2px outline, 2px offset |

### Dark ("Midnight") — `prefers-color-scheme: dark`, `color-scheme: dark` on `:root`
| Token | Hex | Contrast on bg |
|---|---|---|
| `--bg` | `#111B30` | — |
| `--surface` | `#182338` | — |
| `--ink` | `#ECE9DE` | 14.12 |
| `--ink-soft` | `#B7BDCB` | 9.12 |
| `--muted` | `#9AA3B8` | 6.79 |
| `--hairline` | `#25334E` | 1.36 (decorative) |
| `--accent` | `#93B4E8` | 8.12 |
| `--accent-hover` | `#B7CDF5` | 10.68 |
| `--focus` | `#93B4E8` | — |

Selection: `--accent` at 18% alpha, both themes. `theme-color` meta matches `--bg` per scheme.

## 6. Layout & spacing

- Breakpoints **320 / 768 / 1024 / 1440**. Mobile-first.
- Measure: `--measure: 68ch`; content column max `72rem`; gutters `clamp(1.25rem, 5vw, 4.5rem)`.
- Spacing tokens (4px base): `--s-1:.25rem --s-2:.5rem --s-3:.75rem --s-4:1rem --s-6:1.5rem --s-8:2.25rem --s-12:3.5rem --s-16:5.5rem --s-24:8.5rem`. Section rhythm: 5.5–8.5rem desktop, 3.5rem mobile.
- Radius: `--r: 2px` (focus chrome only). Rules: `1px solid var(--hairline)`.
- Shadows: none.
- Grid: hero is a 12-col editorial grid — portrait (5 cols, dot field, arch-top clip) left on ≥1024px; text right; single column stacked below. Essays section is a ruled list (hairline rows), not cards. Footer is a single hairline rule + mono links.
- `scroll-margin-top` on anchors; skip link first in DOM.

## 7. Motion

- None on load. Hover = `color`/`border-color`/`text-decoration` 160ms ease-out. Focus = instant ring (never animated). Active = color-only.
- Any future motion must use transform/opacity only, and live inside `@media (prefers-reduced-motion: no-preference)`. Under reduce: everything is static; color transitions remain but under 200ms.
- No JS-driven animation anywhere; there is no JS.

## 8. Components (built against this contract)

`skip-link · header (wordmark + nav: Essays, About, RSS) · hero (kicker, h1, lede, CTA row, portrait figure w/ figcaption) · essays section (ruled list + honest in-progress state) · about section (bio + "what an essay covers") · colophon (footer: name, year, socials as inline SVG+text) · essays.html (index with empty state) · post template · rss.xml · build.py (zero-dep: scans posts/*.html → regenerates list + rss) · robots.txt · sitemap.xml`

## 9. Copy rules

- Second person when instructing; the site's own voice is first person singular, lowercase-leaning, specific. No exclamation marks. No "I'm passionate about". Concrete beats clever.
- Button labels specific: "Read the essays" / "Follow @muhyoyusuf" / "RSS".
- Ellipsis `…`, curly quotes, `&nbsp;` in units/brand pairs, `&` over "and" when tight. Title Case headings (Chicago), sentence case for meta.

## 10. Verification bar (all reported honestly)

320/768/1024/1440 screenshots; JS-disabled screenshots; zero console errors; Lighthouse (Perf/A11y/BP/SEO); axe-core zero violations; W3C HTML validation; Vercel WIG audit clean; LCP < 2.5s, CLS < 0.1 (simulated throttling); 5-second stranger read (what is this / what do I click). Failures are listed, not polished over.

## 11. Open dependencies (need the owner — tracked, not fabricated)

1. **Starter essays** (interview answer (b)): author-written or explicitly approved drafts. Until then `essays` shows the designed empty state.
2. **Logo/wordmark call**: badge vs. typographic wordmark (default: wordmark on-site; badge kept as-is for avatars).
3. **Deploy**: `muhyo.uz` hosting target + DNS not yet pointed; OG image absolute URL assumes `https://muhyo.uz/`.
4. **Firecrawl** blocked from this IP without API key — reference was analyzed via direct fetch instead (see §2).
5. Firefox/Brave headless cannot reach the network from this machine — all browser verification is local `http://127.0.0.1`/`file://`.
