---
status: pending
priority: p2
issue_id: "003"
tags: [code-review, security]
---

# Security: No explicit Content Security Policy in manifest

## Problem Statement

The extension relies on Chrome MV3's default CSP (`script-src 'self'; object-src 'self'`) rather than declaring an explicit policy. This means `connect-src`, `img-src`, and `style-src` are unrestricted — the popup can fetch any URL, load images from any domain, and load stylesheets from any external host.

## Findings

**Location:** `manifest.json` — no `content_security_policy` key present

Current gaps:
- No `connect-src` restriction (popup can fetch any URL)
- No `img-src` restriction (the card image URL includes `card.id` from external API with no validation)
- `fonts.googleapis.com` and `warcraftcn.com` load without restriction via CSS

## Proposed Solution

Add an explicit CSP to `manifest.json`:

```json
"content_security_policy": {
  "extension_pages": "default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://art.hearthstonejson.com; connect-src https://api.hearthstonejson.com"
}
```

Note: Once Google Fonts is bundled locally (see todo 006), `style-src` and `font-src` directives can be tightened to `'self'` only.

## Acceptance Criteria
- [ ] `content_security_policy` key present in manifest.json
- [ ] `connect-src` restricted to `api.hearthstonejson.com`
- [ ] `img-src` restricted to `art.hearthstonejson.com`
- [ ] Extension still functions (popup loads card, image shows)

## Work Log
- 2026-02-23: Found by security-sentinel agent during full repo review
