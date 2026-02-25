---
status: pending
priority: p2
issue_id: "001"
tags: [code-review, security, xss]
---

# XSS: HTML entity decode performed after tag stripping

## Problem Statement

`formatCardText` in `popup.js` strips HTML tags via regex first, then decodes HTML entities (`&lt;` → `<`). This ordering means entity-encoded payloads survive the sanitization step and are decoded into executable HTML that lands in `innerHTML`.

If `api.hearthstonejson.com` ever serves malicious data (supply chain attack), a payload like `&lt;img src=x onerror=alert(1)&gt;` would bypass the tag stripper and be decoded into a live `<img>` element injected into the DOM.

The allowed `<b>` passthrough makes this worse — `<b onmouseover="...">` also survives with no entity decoding needed.

## Findings

**Location:** `scripts/popup.js:54–60` (formatCardText) and `popup.js:126` (innerHTML assignment)

```javascript
function formatCardText(html) {
  return html
    .replace(/<(?!\/?b\b)[^>]+>/g, '')      // 1. strip tags — entities NOT stripped
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>') // 2. decode entities — now <img> appears!
    ...
}
cardTextEl.innerHTML = formatCardText(card.text); // 3. injected into DOM
```

**Mitigating factors:**
- Data source (`api.hearthstonejson.com`) is a trusted community API over HTTPS
- Chrome MV3 CSP blocks inline event handlers from HTML markup (`script-src 'self'`)
- `<script>` tags injected via innerHTML do not execute in modern browsers

**Risk:** Medium — requires upstream compromise, but the pattern is wrong regardless.

## Proposed Solutions

### Option A: Use `textContent` instead of `innerHTML` (Recommended)
Drop bold formatting, gain complete safety. The card text is rarely formatted and readability is fine without bold.
```javascript
cardTextEl.textContent = stripHtml(card.text);
```
- Pros: Zero XSS risk, simplest fix
- Cons: Loses `<b>` bold formatting in card text
- Effort: Small

### Option B: Fix the decode ordering
Decode entities first, then strip all non-`<b>` tags, then assign to innerHTML.
```javascript
function formatCardText(html) {
  return html
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/<(?!\/?b\b)[^>]+>/g, '')  // strip AFTER decoding
    .replace(/^\[x\]/i, '')
    .trim();
}
```
- Pros: Preserves `<b>` formatting, fixes the ordering vulnerability
- Cons: `<b onmouseover>` style event injection on `<b>` tags still possible
- Effort: Small

### Option C: Add DOMPurify
Bundle DOMPurify with `ALLOWED_TAGS: ['b'], ALLOWED_ATTR: []` config.
- Pros: Correct by construction, allows `<b>` safely
- Cons: Adds a dependency, overkill for this use case
- Effort: Medium

## Acceptance Criteria
- [ ] Entity-encoded HTML payloads cannot reach the DOM as executable HTML
- [ ] Card text still renders (even if bold is dropped in Option A)

## Work Log
- 2026-02-23: Found by security-sentinel agent during full repo review
