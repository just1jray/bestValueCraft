---
status: pending
priority: p3
issue_id: "006"
tags: [code-review, performance, privacy, security]
---

# Google Font loaded from external CDN twice — should be bundled locally

## Problem Statement

The Cinzel font is loaded from `fonts.googleapis.com` on every popup open via two separate declarations that both fire:
1. `<link>` tag in `popup.html:5`
2. `@import` in `styles/warcraft.css:1`

This creates a render-blocking external network request on every popup open, leaks usage data to Google (IP + extension fingerprint), and breaks offline functionality. The font is static and can be bundled locally.

## Findings

**Location:** `popup.html:5` and `styles/warcraft.css:1`

The duplicate import means two DNS lookups on cold opens. The `@import` in `warcraft.css` is completely redundant since `popup.html` already has the `<link>` tag.

## Proposed Solution

1. Download `Cinzel-Regular.woff2` and `Cinzel-Bold.woff2` from Google Fonts
2. Add them to a `fonts/` directory
3. Replace both external references with a local `@font-face` in `styles.css`:
```css
@font-face {
  font-family: 'Cinzel';
  src: url('../fonts/Cinzel-Regular.woff2') format('woff2');
  font-weight: 400;
}
@font-face {
  font-family: 'Cinzel';
  src: url('../fonts/Cinzel-Bold.woff2') format('woff2');
  font-weight: 700;
}
```
4. Remove `<link>` from `popup.html` and `@import` from `warcraft.css`

## Acceptance Criteria
- [ ] No outbound requests to `fonts.googleapis.com` when popup opens
- [ ] Cinzel font renders correctly in popup
- [ ] Popup works offline

## Work Log
- 2026-02-23: Found by security-sentinel and architecture-strategist agents during full repo review
