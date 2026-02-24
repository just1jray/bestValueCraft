---
status: pending
priority: p3
issue_id: "008"
tags: [code-review, quality, css]
---

# Bloated warcraft.css: ~85% of CSS classes are never used

## Problem Statement

`styles/warcraft.css` is 388 lines, but only ~15% of its classes are referenced in `popup.html`. The unused portions include faction skeleton variants, icon patterns, avatar variants, cursor variants, and various border frame classes — none of which appear in the popup. Several reference external URLs (warcraftcn.com) and non-existent local files (`../assets/cursors/`).

## Findings

**Location:** `styles/warcraft.css`

**Unused class groups:**

| Class Group | Lines | Notes |
|---|---|---|
| `.wc-skeleton`, `.wc-skeleton-orc/elf/human/undead` | 56–123 | Faction skeletons — only the child `.wc-skeleton-shimmer` is used |
| Faction shimmer color rules | 147–213 | Never triggered (no faction parent class) |
| `.wc-skeleton-icons` + faction variants | 226–261 | Never referenced |
| `.wc-avatar-*` (5 variants) + `.wc-avatar-frame` | 338–363 | Never referenced; references warcraftcn.com |
| `.wc-orc/human/elf/undead-cursor` | 369–387 | References `../assets/cursors/*.cur` files that don't exist |
| `.wc-btn-border`, `.wc-btn-border-sm`, `.wc-btn-border-frame`, `.wc-btn-border-frame-sm` | 10–24 | References warcraftcn.com; never used |
| `.wc-btn-bg`, `.wc-card-bg` | 43–49 | References warcraftcn.com; never used |
| `.wc-input-border`, `.wc-dropdown-border`, `.wc-textarea-border` | 30–40 | Never used |
| `.wc-tooltip-base` | 286–292 | Never applied |
| `.wc-tooltip-uncommon` | 303–309 | Never applied (no Uncommon rarity in HS) |
| `.clip-path-banner` | 277–279 | Never referenced |

**Classes actually used:** `.wc-card-border` (local image ✓), `.wc-skeleton-shimmer`, `.wc-tooltip`, `.wc-tooltip-rare`, `.wc-tooltip-epic`, `.wc-tooltip-legendary`, `.fantasy`

## Proposed Solution

Trim `warcraft.css` to only the classes the extension actually uses. Remove all unused class groups. This also resolves todo 004 (warcraftcn.com external requests) automatically.

The resulting `warcraft.css` should be ~50 lines rather than 388.

## Acceptance Criteria
- [ ] All unused CSS classes removed from warcraft.css
- [ ] Extension visual appearance unchanged
- [ ] No CSS references to non-existent `../assets/cursors/` files
- [ ] No CSS references to warcraftcn.com remain

## Work Log
- 2026-02-23: Found by architecture-strategist and code-simplicity-reviewer agents during full repo review
