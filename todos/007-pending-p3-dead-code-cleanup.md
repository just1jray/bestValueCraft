---
status: pending
priority: p3
issue_id: "007"
tags: [code-review, quality, dead-code]
---

# Dead code: sortByFrequency, stripHtml, jquery-3.4.1.min.js, imageUrl field

## Problem Statement

The codebase contains multiple dead code items that add maintenance burden, confusion, and in the case of jQuery, a known CVE vulnerability.

## Findings

### 1. `sortByFrequency` function — `content.js:85–99`
Defined but never called anywhere. Appears to be a prototype for the "ranked list" roadmap feature. Also contains a logic bug (uses loose equality `== 1`). **15 lines of dead code.**

### 2. `stripHtml` function — `popup.js:46–52`
Never called anywhere. Near-duplicate of `formatCardText` (only differs in one regex). **7 lines of dead code.**

### 3. `scripts/jquery-3.4.1.min.js`
Not listed in `manifest.json`, not referenced anywhere. **87KB dead file.** jQuery 3.4.1 predates the CVE-2020-11022 and CVE-2020-11023 XSS fixes. Its presence risks accidental future use of the vulnerable library.

### 4. `imageUrl` in `findBestCraft()` return value — `content.js:16`
`findBestCraft()` builds an `imageUrl` value and includes it in the result object, but `popup.js` never reads it — it reconstructs the image URL itself from `card.id`. The field is computed and carried through the pipeline for nothing.

### 5. 3× `console.log` in content.js — lines 1, 20, 40
Debug logging left in production code, runs on every HSReplay page load.

## Proposed Solution

Remove all of the above:
- Delete `sortByFrequency` function (content.js:85–99)
- Delete `stripHtml` function (popup.js:46–52)
- Delete `scripts/jquery-3.4.1.min.js` from the repo
- Remove `imageUrl` from `findBestCraft()` return object
- Remove all 3 `console.log` calls from content.js

## Acceptance Criteria
- [ ] `scripts/jquery-3.4.1.min.js` deleted from repo
- [ ] `sortByFrequency` function removed
- [ ] `stripHtml` function removed
- [ ] `imageUrl` removed from content.js result object
- [ ] All 3 `console.log` calls removed from content.js
- [ ] Extension still functions correctly

## Work Log
- 2026-02-23: Found by multiple agents (pattern-recognition-specialist, architecture-strategist, code-simplicity-reviewer) during full repo review
