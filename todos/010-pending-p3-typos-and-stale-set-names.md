---
status: pending
priority: p3
issue_id: "010"
tags: [code-review, quality, polish]
---

# Polish: Typos and stale/incorrect SET_NAMES entries

## Problem Statement

Several small polish issues across the codebase:

1. **"occurance" typo** appears 6+ times in `content.js` and once in the public-facing manifest description
2. **`TITANS: 'TITANS'`** in `SET_NAMES` — every other entry has a human-readable title but this one uses the raw key as its value (should be `'Titans'`)
3. **`SET_NAMES` will go stale** — hardcoded set list already missing newer sets; future sets will show raw codes like `NEW_SET_NAME` (the fallback `setCode.replace(/_/g, ' ')` partially handles this but produces ugly output)

## Findings

**Typo locations:** `content.js:12, 64, 66, 67, 78, 79, 82` and `manifest.json:4`
```
"occurance" → "occurrence" (7 instances)
```

**Wrong value:** `popup.js:31`
```javascript
TITANS: 'TITANS',  // should be 'Titans'
```

**Stale set list:** `popup.js:1–39` — the SET_NAMES table ends at `BATTLE_OF_THE_BANDS` but the actual last two entries `SPACE` and `ISLAND_VACATION` appear present. Any future expansion not in the table will display as underscored raw code.

## Proposed Solution

1. Fix all 7 "occurance" → "occurrence" instances (function name + variables + manifest)
2. Fix `TITANS: 'TITANS'` → `TITANS: 'Titans'`
3. Consider fetching set names from the hearthstonejson API at runtime instead of maintaining a static table (the card metadata already includes `card.set`)

## Acceptance Criteria
- [ ] No "occurance" spelling anywhere in codebase or manifest
- [ ] `TITANS` maps to `'Titans'` in SET_NAMES
- [ ] Manifest description has correct spelling visible in Chrome Web Store

## Work Log
- 2026-02-23: Found by pattern-recognition-specialist agent during full repo review
