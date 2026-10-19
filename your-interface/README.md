# REALLMS / Your Interface

Independent concept 03: a capability-first introduction to one service with multiple interfaces. Work-agnostic descriptions, a substantial visible capability inventory, peer connection options, then model details and support. Neither earlier concept is required or modified.

## Preview

From `api-sites/`, run `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173/your-interface/`.

No build step or dependencies. Only `index.html`, `styles.css`, `data.js`, and `app.js` are public application assets. Do not publish the sandbox, tests, README, or KB capture. Publication is not authorized. `noindex` discourages indexing; it is not privacy or access control.

## Review Focus

Consider the balance between capabilities and connections, the inventory's readability, and whether the interface selector makes access clear without prescribing work. API prerequisites are shared across API connections. All guides remain readable without JavaScript, with authoritative KB links for examples and model lists.

## Content Boundaries

- The local KB capture and linked IU KB articles remain authoritative. Chat explicitly documents images and document uploads; specialized API document processing is distinct. Capability availability does not establish support in every client.
- Independent sanitized October 14, 2026 model/recipe snapshot: four KB-listed Chat models and ten production-discovered API models. No live refresh, inference, or uptime verification. `qwen3.8-27b` type/endpoints remain unverified.
- Recipes retain cURL 8.3+, OpenCode V2, Pi, and Continue Chat-only caveats. No authenticated integration or tool-calling verification. No credentials are collected. External tools do not automatically inherit service data approval.
- Official IU mark and Benton fonts load from IU hosts, with system font fallback. No third-party runtime JavaScript, analytics, backend, or live chat.

## Verification

Run `node --test api-sites/your-interface/tests.mjs` from the workspace root. These are static/data contract tests, not browser interaction tests.

### Browser Verification / 2026-10-16

Session-based Chromium checks using agent-browser (not a committed browser regression suite):

- All 40 combinations of 320/390/768/1440px, four connection routes plus the Pi variant, and both catalogs: no page-level overflow. Code and mobile tables scroll inside focusable regions.
- Four route selections, shared prerequisite visibility/focus, direct `#api-access` entry, terminal deep-link reload, back/forward navigation, and preservation of unrelated section hashes passed. Keyboard Enter activation and Tab into prerequisite links passed; focus outlines were present.
- All four recipe configurations, six capability filters, 54 name/ID/type/endpoint search cases, empty results, reset, and catalog switching passed. Capability filters deliberately show API models; switching catalogs clears filters.
- Copy payload and mocked success/denial feedback passed. Native clipboard writing was denied in this browser session; no successful native write or OS paste round trip is claimed.
- Actual JavaScript-disabled reload: every guide and authoritative fallback remained available, without overflow at any tested width. Reduced motion changed scrolling to `auto`; no active animations.
- Eight axe-core 4.12.1 audits across 390/1440px, Chat/Direct API routes, and both catalogs: zero automatic violations. Incomplete contrast checks remain for a decorative arrow and clipped content inside mobile table scrolling. No screen-reader testing performed.
- No captured console messages or page errors. Previous-concept SHA-256 hashes were unchanged after the build.

Screenshots: `/var/folders/zn/wy13f8jx3l12fsp4lp_bp_900000gn/T/opencode/your-interface-desktop.png`, `your-interface-hero.png`, and `your-interface-mobile.png`. These are temporary review artifacts, not public assets. Image inspection was unavailable to the agents, so human visual review remains necessary.

No authenticated integrations, inference, commit, or deployment performed.
