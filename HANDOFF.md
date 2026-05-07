# $PIBBLE — Project Handoff

> Snapshot for session restart. Everything below is committed to git and live on GitHub Pages.

## 🟢 Live URLs

- **Site:** https://alnasarmasarhtml.github.io/pibble-eth/
- **Repo:** https://github.com/Alnasarmasarhtml/pibble-eth
- **Local dev:** `cd "/Users/nik/Desktop/Pibble Project" && python3 -m http.server 8767`

## Status

**v3 shipped.** All committed + pushed (commit `1895df6`).

## What's in the build

### Visual / motion
- Full-screen ocean canvas with multi-layer animated sine waves + drifting caustic dots (60fps)
- Cursor ripples — every mouse move drops a concentric ripple; click drops a deeper splash; mobile uses device tilt
- Bubble cursor trail (desktop only) — green-blue bubbles spawn from cursor and drift up
- 22 pibble parallax field — randomly positioned pibbles drifting at different depths and speeds
- Hero portal with the new video (`assets/pibble-hero.mp4`) on autoloop in a wave-shaped frame with shine + reflection overlays
- 3 animated wave SVG dividers between sections (yellow / cyan / pink) sliding horizontally
- Brand mark bounces in topbar
- Section sticker wobbles, tilt-on-hover cards, button shine sweep on primary CTAs

### Sections
1. Hero (video portal + manifesto + CTAs)
2. Animated wave divider
3. Ticker (rotating catchphrases)
4. Watch deck (reference video + 3 platform cards: X / TikTok / Telegram)
5. The Pack (31-sticker grid)
6. The Code (5 surf steps with sticker illustrations)
7. Tokenomics (4 cards: 0% tax / 100% LP burned / 0 team / ∞ vibes)
8. How to Buy (3 steps + CA + Uniswap CTA)
9. Quote card
10. Footer with floating mark + socials

### Audio
- Full Milky "Just The Way You Are" track (5MB, looped)
- Auto-plays on first interaction
- Mute toggle in topbar

### Assets
- `assets/pibble-hero.mp4` — new dancing pibble video (10MB)
- `assets/pibble-hero.png` — original surfing pibble hero image
- `assets/pibble-reference.mp4` — TikTok reference clip (3.3MB)
- `assets/pibble-song.mp3` — full Milky track (5MB)
- `assets/stickers/01.png` → `31.png` — all 31 extracted pibble poses with transparent backgrounds
- `assets/x-logo.webp`, `tiktok-logo.webp`, `telegram-logo.webp` — platform logos

## What's wired vs placeholder

| Item | State |
|---|---|
| X handle | `https://x.com/ethpibble` |
| TikTok | `https://www.tiktok.com/@pibblefluencer` |
| Telegram | `#` placeholder |
| Contract address | `CA · coming soon` placeholder |
| Uniswap link | `#` placeholder |
| DexScreener link | `#` placeholder |

## Open asks (for the next session)

1. **Telegram URL** — replace `#` with real `t.me/...`
2. **CA + Uniswap + DexScreener** — wire when token deploys
3. **Two more pibble images** — user mentioned 4 total, only 2 sheets received so far
4. **Domain** — currently on github.io subdomain. Pick a custom domain when ready.

## Code map

```
/Users/nik/Desktop/Pibble Project/
├── index.html        — structure + sections
├── styles.css        — full design system + responsive
├── script.js         — ocean canvas + bubbles + parallax + audio + UI
├── assets/
│   ├── pibble-hero.mp4
│   ├── pibble-hero.png
│   ├── pibble-reference.mp4
│   ├── pibble-song.mp3
│   ├── x-logo.webp
│   ├── tiktok-logo.webp
│   ├── telegram-logo.webp
│   └── stickers/01.png … 31.png
├── HANDOFF.md        — this file
└── .git/
```

## Key code locations

- **CONFIG object** in `script.js` lines 6–17 — change links + CA here, they propagate everywhere
- **Ocean canvas** in `script.js` lines 110–198 — the wave + ripple system
- **Bubble cursor** in `script.js` lines 200–253 — desktop-only trail
- **Pibble parallax** in `script.js` lines 255–315 — 22-sticker scroll-parallax field
- **Hero portal** in `index.html` lines 50–72 — video + sticker decoration
- **Sticker grid** populated at runtime by `script.js` lines 65–84 (uses all 31)

## How to redeploy

```bash
cd "/Users/nik/Desktop/Pibble Project"
git add -A
git commit -m "msg" --no-verify
git push
# GitHub Pages auto-rebuilds in ~60–90s
```

## Cache-bust strategy

`styles.css?v=3` and `script.js?v=3` are versioned. Bump `?v=4` etc. on every deploy if you need browsers to refetch immediately.

---

*ready for restart.*
