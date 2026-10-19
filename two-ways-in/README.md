# REALLMS / Two Ways In

First design concept. Static HTML, CSS, and JavaScript, no build step or runtime dependencies. This is a public-information prototype, not a working chat client.

## Preview

From `api-sites/`, run `python3 -m http.server 4173 --bind 127.0.0.1` and visit `http://localhost:4173/two-ways-in/`. Serving the parent also tests the subdirectory paths used by GitHub Pages. Directly opening index.html works, but clipboard access may be unavailable.

## Files

- `index.html`: editorial content, accessible guides, resource links.
- `styles.css`: concept-specific light IU-informed design.
- `data.js`: public model snapshot and documentation-backed recipes. No secrets.
- `app.js`: guide tabs, recipe selection, catalog search/view, copy feedback.

Approved reference: `docs/superpowers/specs/2026-10-14-reallms-two-ways-in-design.md` at the workspace root.

## Publishing later

Deploy only this directory's public assets, not the sandbox, local configuration, tests, or source KB captures. The four public files are `index.html`, `styles.css`, `data.js`, `app.js`. They can be placed in a `two-ways-in/` folder in a dedicated GitHub Pages artifact alongside future concepts. No root-relative asset paths or SPA fallback are required.

The robots meta tag discourages indexing. This is not authentication or privacy; anyone who obtains the link can visit. A public repository can reveal the URL and content. No deployment, GitHub settings changes, or commits are part of this first pass.

Official trident image and Benton Sans fonts are loaded from IU asset hosts. System font fallbacks remain usable if the font host is unavailable. No other third-party assets or analytics are loaded.

## Evidence and limits

- API IDs: authenticated discovery from the configured production host on 2026-10-14, `/direct/models`. Credentials never exported into the site. Discovery is not inference verification.
- Endpoint mappings: API KB KB0027272; documented base `/direct/v1`. `qwen3.8-27b` is discovered but its type/endpoint remain explicitly unverified.
- Chat models: separate KB list KB0027284, not a live authenticated Chat inventory. Do not automatically merge API models into it.
- Public Chat login verified to offer "Continue with IU Login". No authenticated UI reproduced; the conversation is clearly illustrative.
- RTProjects public landing page verifies project creation and student PI username requirement. Authenticated controls/turnaround not claimed.
- Tool recipes: current official documentation checked 2026-10-14; no end-to-end agent/tool-call tests. OpenCode is explicitly V2; Pi follows current upstream; Continue is Chat only; cURL requires 8.3+.
- Model request and Slack destinations resolved from live IU KB. Authenticated form/channel contents not inspected.
- Without JavaScript, both guides remain readable and catalog/recipe fallbacks link to the authoritative KB. Search and copy require JavaScript.

## Design review focus

Review first-screen hierarchy, workflow distinction, balance between Chat and API, density of the selected guide, catalog readability, and desktop/mobile composition. Model metadata can be corrected in `data.js` without restructuring the page. Future visual concepts should remain independent rather than becoming themes of this layout.

## Verification / 2026-10-15

Browser checks used agent-browser with Chromium, serving this directory under `/two-ways-in/`. These were session-based checks, not a committed automated test suite.

- Passed comparison-link selection and panel focus, tab keyboard navigation (Left/Right/Home/End), guide deep links, reload, and preservation of unrelated section hashes. Fixed stale guide hashes when changing an already deep-linked guide.
- Passed all four recipe selections, both model catalogs, name/type/endpoint search, empty states, and filter resets. Clipboard success and denial feedback passed with in-memory mocks; native clipboard access remains untested.
- Checked 320, 390, 768, and 1440px widths across both guide states and all recipes. No document-level horizontal overflow. Long code scrolls within its focusable example region.
- With JavaScript genuinely disabled, both guides and KB fallback links remained available. Reduced-motion checks passed. No page JavaScript errors were observed; JavaScript syntax checks passed.
- Final axe-core 4.12.1 audits: zero automatic violations in either guide. Added explicit roles for the labeled diagram and code region. One manual contrast-review item remains for the decorative down-arrow; no screen-reader testing performed.
- Full-page Chat/API screenshots captured at 1440px and 390px in `/var/folders/zn/wy13f8jx3l12fsp4lp_bp_900000gn/T/opencode/two-ways-in-{chat,api}-{desktop,mobile}.png`. These are temporary review artifacts, not deployment assets. Image viewing was unavailable to the reviewing agents, so visual polish still needs human review.

No authenticated integrations, model inference, deployment, or commits were performed. The evidence and limits above still apply.
