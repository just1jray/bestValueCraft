---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, security, performance]
---

# Supply chain risk: External assets loaded from warcraftcn.com

## Problem Statement

`styles/warcraft.css` references 8+ external URLs from `warcraftcn.com`. These CSS classes are never applied in the current `popup.html`, but their URL references cause the browser to make outbound network requests to a third-party domain on every popup open. If `warcraftcn.com` is compromised or its domain expires and is re-registered, the extension's visual assets could be replaced.

Additionally, the extension's manifest only claims `activeTab` permission, but the popup silently phones home to `warcraftcn.com` on every open.

## Findings

**Location:** `styles/warcraft.css:11–48, 339–355`

```css
.wc-btn-border { border-image-source: url("https://warcraftcn.com/warcraftcn/button-bg.webp"); }
.wc-btn-border-sm { border-image-source: url("https://warcraftcn.com/warcraftcn/button-bg-sm.webp"); }
.wc-avatar-default { --wc-frame-url: url("https://warcraftcn.com/warcraftcn/avatar-default.webp"); }
/* ... 5+ more external URL references */
```

All classes referencing `warcraftcn.com` are unused in the current popup (the active card frame uses local `images/card-bg.webp`). See also todo 008 about removing the unused CSS classes entirely — if those classes are removed, this issue is resolved automatically.

## Proposed Solutions

### Option A: Remove unused CSS classes (Recommended — resolves this + todo 008)
Delete all CSS class groups that are never applied in popup.html. The warcraftcn.com URLs are only on unused classes.
- Effort: Small (~150 lines of CSS removed)

### Option B: Bundle assets locally
Download the warcraftcn.com assets into `images/` and update the CSS references.
- Effort: Medium (need to fetch each file)

## Acceptance Criteria
- [ ] No outbound requests to `warcraftcn.com` when popup opens
- [ ] Extension visual appearance unchanged

## Work Log
- 2026-02-23: Found by security-sentinel and architecture-strategist agents during full repo review
