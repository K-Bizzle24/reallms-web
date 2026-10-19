# REALLMS / Try It. Then Scale It.

Independent concept 02: a vertical, Chat-first journey on a white and cream canvas. Bold typography, small pastel surfaces, and saturated accents replace paired comparison columns. The first concept is not modified or required at runtime.

## Preview

Serve `api-sites/` with `python3 -m http.server 4173 --bind 127.0.0.1`, then visit `http://127.0.0.1:4173/try-then-scale/`.

Static HTML/CSS/JavaScript, no build dependencies. Publish only `index.html`, `styles.css`, `data.js`, and `app.js` from this directory if publication is later authorized. No commit or deployment is included. The robots directive discourages indexing, not access: this is public information, not a private application.

## Content And Scope

- Chat first, API second. Both journeys stay visible without JavaScript; native anchors allow direct access to API setup. No fake conversation or credential entry.
- Model and recipe data are an independent copy of the public snapshot checked October 14, 2026. Chat inventory is KB-listed, not live verified. API discovery is not inference verification. `qwen3.8-27b` type and endpoint remain unverified.
- Recipes retain their documented version and compatibility limits: OpenCode V2, current Pi configuration, Continue Chat only, cURL 8.3+. No authenticated integration or tool-calling tests are claimed.
- The API is shared and in beta. "Scale" means connecting and repeating useful work, not unlimited capacity or smarter models. High-throughput work requires separate guidance.
- IU hosts the official mark and Benton fonts; system fonts remain available as fallback. No analytics or other third-party runtime libraries.
- Content authority: the local `api-sites/reallms_kb_pages` capture and its linked IU KB sources. External tools do not automatically inherit REALLMS data approval.

## Review Focus

Review the energy of the first screen, prompt readability, the length and rhythm of the vertical journey, and the transition into API setup. White and cream are the page backgrounds; color emphasizes actions and selected content rather than filling entire sections.

## Verification / 2026-10-15

Run the lightweight static/data contract tests with `node --test api-sites/try-then-scale/tests.mjs` from the workspace root. These check independent assets, local targets, unique IDs, snapshot metadata, and recipe completeness. They do not replace browser interaction tests. Do not deploy `tests.mjs` or this README as application assets.

Session-based Chromium checks with agent-browser passed:

- 320, 390, 768, and 1440px widths across all recipes and both catalogs, with no page-level horizontal overflow. Code examples scroll inside their focusable regions.
- All four recipes, 84 catalog search cases, empty states, catalog reset, copyable prompts, and copy feedback. Native clipboard writes succeeded with a call-through spy; clipboard readback was denied. Mocked success and rejection paths also passed; no OS paste round trip is claimed.
- Keyboard skip/section links, sequential focus, selectors, catalog switching, and code-region scrolling.
- Actual JavaScript-disabled reloads with both guides and fallback links visible, plus reduced-motion settings.
- Forty initial axe audits and final desktop/mobile rechecks: zero automatic violations. Manual contrast flags remain for decorative glyphs/code content; no screen-reader or pixel-level visual review was available.
- Final pass found no console messages or JavaScript errors. Mobile login-note spacing was corrected, and the explicit official IU favicon returned HTTP 200.

Screenshots are temporary review artifacts at `/var/folders/zn/wy13f8jx3l12fsp4lp_bp_900000gn/T/opencode/try-scale-desktop.png`, `try-scale-mobile.png`, and `try-scale-hero.png`. Authenticated integrations and inference remain untested. No deployment or commit performed.
