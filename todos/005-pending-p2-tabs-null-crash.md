---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, reliability, crash]
---

# Crash: `tabs[0]` accessed without null check

## Problem Statement

`popup.js` calls `chrome.tabs.query()` and immediately accesses `tabs[0].id` without checking if `tabs` is empty. If the popup is opened when there is no active tab (e.g., from the extensions management page), `tabs[0]` is `undefined` and `.id` throws a `TypeError`. The `chrome.runtime.lastError` guard is inside the `sendMessage` callback, so it never fires.

The user sees the loading spinner indefinitely with no error — the popup appears completely broken.

## Findings

**Location:** `scripts/popup.js:140–142`

```javascript
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: 'getBestCard' }, function(response) {
    if (chrome.runtime.lastError || !response || !response.card || !response.card.name) {
      // This never fires if tabs[0] is undefined — crash happens on line above
```

## Proposed Solution

```javascript
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  if (!tabs || !tabs[0]) {
    showError();
    return;
  }
  chrome.tabs.sendMessage(tabs[0].id, { type: 'getBestCard' }, function(response) {
    if (chrome.runtime.lastError || !response || !response.card || !response.card.name) {
      showError();
      return;
    }
    // ...
  });
});
```

## Acceptance Criteria
- [ ] Opening popup with no active tab shows the error state (not infinite loading)
- [ ] No uncaught TypeError in the browser console

## Work Log
- 2026-02-23: Found by architecture-strategist and pattern-recognition-specialist agents during full repo review
