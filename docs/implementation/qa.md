# Portfolio verification

Validated locally on 2026-10-12 before publication. Reference: https://hancore.dev. Implementation: Next.js static export for https://aziztoba.github.io.

## Visual comparison

Eight matched live-reference / implementation screenshot pairs were captured with Chromium at 1440×900, 768×844, 390×844 and 360×844. Local evidence: `docs/qa/comparison.html`, PNGs and `measurements.json`. Both sites were rendered with reduced motion for comparable captures; normal-motion behavior was separately exercised.

| Measurement | Reference | Portfolio |
| --- | --- | --- |
| Desktop editor x / y | 216 / 78 | 216 / 78 |
| Desktop editor width / height | 1008 / 579 | 1008 / 579 |
| Desktop terminal x / width | 460.8 / 532.8 | 460.8 / 532.8 |
| Desktop blueprint y / height | 104 / 300 | 104 / 300 |
| Desktop footer y | 657 | 657 |
| Mobile editor y | 78 | 78 |
| Mobile blueprint y / height | 104 / 240 | 104 / 240 |
| Font / character grid | IBM Plex Mono, 12px / 13px | IBM Plex Mono, 12px / 13px |

Observed discrepancies corrected during comparison: wheel curve offset, tree placement and density, duplicate blueprint border, compact mobile blueprint visibility/shape, archive tree presentation, entrance reduced-motion height, mobile text wrapping and palette link colors.

## Functional checks

- Six Node tests: command aliases/errors/parent navigation, 28 palettes, four featured projects, public content constraints and genuine GitHub counts.
- Thirteen Chromium tests: entrance, commands, theme search/cancel/persistence and all 28 choices, every destination, history, malformed hashes, blocked localStorage, wheel keyboard/drag, buffer focus, galleries/lightbox/focus restoration, original film playback, résumé PDF, normal-motion typing/slideshow, four viewport geometries, ordinary Tab access to content and keyboard activation of external links.
- `npm run typecheck`, `npm run build`, `git diff --check` and production dependency audit. Zero production dependency vulnerabilities reported at verification time.
- PDF generated from approved DOCX with phone removed, unsupported 8+ years corrected to documented start date, and APEX .NET 8 corrected to .NET. PDF text checked after conversion. Original DOCX remains private.

## Intentional differences and limits

This is an original recreation, not a claim of identical pixels. Text, monogram, code examples, tree/eye/hand geometry and preview graphics differ. No reference-owner source code, personal likeness, screenshots or metrics are shipped as portfolio assets.

Professional project previews are public-safe original technical illustrations, not private employer application screenshots. The Voice Agent gallery includes a 12-second original silent workflow animation; it is not the reference owner's 49-second video. Native video controls and native accessible dialogs preserve playback, keyboard and focus behavior, with different control rendering across browsers.

GitHub repository/activity data is a dated public snapshot. The visitor-count slot instead displays genuine GitHub activity; no visit counter or fabricated traffic is present. Theme archives retain the graph presentation but omit reference-owner theme authorship, release dates and stars. Personal text length naturally changes terminal line breaks and scroll depth.

Terminal commands reveal at the measured character cadence; output clips reveal on a 13px grid at 14ms per line. Procedural motion is original and approximate. Chromium desktop and mobile/touch emulation were tested; physical iOS/Android, Safari, Firefox and screen-reader software were not tested.

## Deployment

The previous repository consists of `index.html` at `b23533737ae9e5233480d2bc70b1ba30888cae0b`. Preserve it on `archive/pre-terminal-2026-10-12`; retain original commit ancestry. Deploy only the reviewed application, public assets, tests, workflow and safe documentation. Local employer sources, CV source, research artifacts and `.serena` are excluded.

GitHub Actions installs pinned dependencies, tests, typechecks, builds a static export, runs Chromium integration tests and deploys the `out/` Pages artifact. See the repository Actions history for the exact deployed commit and run.

Independent read-only review identified three issues, all fixed with regression tests: buffer Tab focus loop, entrance Enter overriding anchors, and unsorted GitHub contribution dates. No deferred minor findings.
