---
status: pending
priority: p3
issue_id: "009"
tags: [code-review, quality, refactor]
---

# Refactor: Replace parallel array pattern with array of objects in content.js

## Problem Statement

`content.js` tracks card data as three synchronized parallel arrays (`names`, `images`, `cardIds`) instead of an array of card objects. Every operation that mutates or reads this data must be applied to all three arrays in lockstep, manually. A missed push on any array silently produces wrong results with no error.

The `trimMultiplierText` function reflects this pain: it takes three separate array arguments and triples every push, resulting in 17 lines for what should be 4–5. The generic parameter name `parallelArray2` is a code smell.

## Findings

**Location:** `scripts/content.js:24–62`

```javascript
// Current: 3 parallel arrays that must always move together
var names = [];
var images = [];
var cardIds = [];
return [ names, images, cardIds ];

// And then in trimMultiplierText:
function trimMultiplierText(array, parallelArray, parallelArray2) {
  newArray.push(trimmed, trimmed);
  newParallelArray.push(parallelArray[i], parallelArray[i]);   // must not forget any
  newParallelArray2.push(parallelArray2[i], parallelArray2[i]); // must not forget any
```

**Also:** `findBestCraft` does `allCraftableCards[0].indexOf(bestValueCraftCard[0])` to recover the index and cross-reference the other arrays — this is the classic "parallel array index dance."

## Proposed Solution

Refactor to array of objects:

```javascript
// getCardData returns [{name, cardId}] (imageUrl computed in popup.js, not here)
function getCardData() {
  const cards = [];
  document.querySelectorAll('.craftable').forEach(function(el) {
    var name = el.getAttribute('aria-label');
    var bg = el.style.backgroundImage;
    var match = bg.match(/url\(["']?([^"')]+)["']?\)/);
    var cardId = match ? match[1].split('/').pop().replace(/\.\w+$/, '') : null;
    if (name && cardId) cards.push({ name, cardId });
  });
  return cards;
}

// expandCopies replaces trimMultiplierText — 17 lines → 7
function expandCopies(cards) {
  var result = [];
  cards.forEach(function(card) {
    if (card.name.slice(-3) === ' ×2') {
      var trimmed = { name: card.name.slice(0, -3), cardId: card.cardId };
      result.push(trimmed, trimmed);
    } else {
      result.push(card);
    }
  });
  return result;
}
```

This is related to dead code cleanup (todo 007) — `imageUrl` can be dropped from the returned object since popup.js never uses it.

## Acceptance Criteria
- [ ] `getCardData` returns array of `{name, cardId}` objects
- [ ] `trimMultiplierText` replaced with `expandCopies` operating on objects
- [ ] `findBestCraft` updated to work with new structure
- [ ] No parallel array index access patterns remain
- [ ] Extension still correctly identifies the best card

## Work Log
- 2026-02-23: Found by architecture-strategist and code-simplicity-reviewer agents during full repo review
