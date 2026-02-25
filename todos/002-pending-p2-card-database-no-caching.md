---
status: pending
priority: p2
issue_id: "002"
tags: [code-review, performance]
---

# Performance: Full card database fetched on every popup open (no caching)

## Problem Statement

Every time the user opens the extension popup, `popup.js` downloads the entire Hearthstone collectible card database (`cards.collectible.json`) — approximately 4–8MB of JSON — just to look up one card by ID. There is no caching, so this network roundtrip happens on every single popup open.

This creates a 1–2+ second loading delay every time the popup is opened. The database also grows with every expansion.

## Findings

**Location:** `scripts/popup.js:149–162`

```javascript
fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json')
  .then(function(res) { return res.json(); })
  .then(function(cards) {
    var card = cards.find(function(c) { return c.id === cardData.cardId; });
    // finds ONE card from 2000+ entries
  });
```

- The payload is ~4–8MB and contains 2,000+ cards
- `cards.find()` is O(n) over the entire array
- No `AbortController` timeout — popup hangs indefinitely if API is slow/down
- The Chrome popup context is destroyed when closed, so no in-memory caching survives

## Proposed Solutions

### Option A: `chrome.storage.local` cache with 24h TTL (Recommended)
```javascript
const CACHE_KEY = 'hs_cards';
const TTL = 24 * 60 * 60 * 1000;

function getCards(callback) {
  chrome.storage.local.get(CACHE_KEY, function(result) {
    const cached = result[CACHE_KEY];
    if (cached && Date.now() - cached.ts < TTL) {
      callback(cached.cards);
      return;
    }
    fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json')
      .then(res => res.json())
      .then(cards => {
        const store = {};
        store[CACHE_KEY] = { cards, ts: Date.now() };
        chrome.storage.local.set(store);
        callback(cards);
      });
  });
}
```
Requires adding `"storage"` to `manifest.json` permissions. Build a card ID index (`cardIndex[c.id] = c`) at cache-write time for O(1) lookups.
- Pros: Sub-10ms on repeat opens, eliminates the performance problem permanently
- Effort: Medium

### Option B: Add timeout only (partial fix)
Add `AbortController` with 8s timeout to prevent indefinite hanging, without full caching.
- Pros: Fixes the infinite-hang edge case
- Cons: Still downloads 4–8MB every popup open
- Effort: Small

## Acceptance Criteria
- [ ] Second+ popup opens are sub-100ms (no network fetch)
- [ ] Cache expires and refreshes after 24 hours
- [ ] `"storage"` added to manifest permissions if using Option A
- [ ] Popup shows error state within 8 seconds if API fails

## Work Log
- 2026-02-23: Found by performance-oracle agent during full repo review
