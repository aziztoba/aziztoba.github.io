# Abdulaziz Toba / AI Engineer

A terminal portfolio with a rotating project wheel, Vim navigation, 28 persistent colorschemes, procedural graphics, project galleries and a downloadable résumé.

Live: https://aziztoba.github.io

## Run locally

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Enter opens the portfolio. Use ↑/↓ or j/k on the wheel, Tab to focus the buffer, g/G to scroll, ←/→ for gallery images, Enter to enlarge, and Escape to close. On mobile, tap `~/Projects` and swipe the wheel.

Commands include `:e stack`, `:e experience`, `:e more`, `:theme`, `:colorscheme whitegold`, `:cd ..`, and `:q`. The entrance `:theme` picker supports search, arrows, Enter and Escape.

## Update content

- `data/profile.ts`: identity, professional history, skills and curated projects.
- `data/github.json`: public GitHub snapshot. Refresh with `npm run refresh:github`; counts are dated observations, not live visitor metrics.
- `data/themes.json`: palette definitions. Theme and motion behavior is in reusable React components.
- `public/previews/`: original illustrative project studies. No employer code or application screenshots are published.
- `public/Abdulaziz_Toba_AI_Engineer_CV.pdf`: phone-free résumé, corrected against documented dates. Regenerate locally with `python3 scripts/build-resume.py '/path/to/approved.docx'` (LibreOffice and pdftotext required). The DOCX stays private.

Generate SVG studies with `node --experimental-strip-types scripts/generate-previews.ts`. The short voice workflow film is an original silent conceptual animation, not employer application footage.

## Verify and build

```sh
npm test
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

The production export is `out/`. Both `/` and `/site/` are static routes; no server or secret is needed. GitHub Actions verifies and deploys main to GitHub Pages using the built-in Pages token. Set Pages source to **GitHub Actions**. Hash routes and root-relative assets target the user site, not a repository subdirectory.

## Design and asset provenance

Layout, typography, palette behavior and interaction patterns were studied from [hancore.dev](https://hancore.dev). Application code, AT monogram, procedural graphics, code examples and project studies are original. Reference-owner identity, source code, imagery and metrics are not included in application assets. IBM Plex Mono is distributed with its [SIL Open Font License](public/fonts/OFL.txt).

Professional descriptions are based on the approved CV and local repository inspection, restricted to public-safe high-level information. Public engineering examples are explicitly labeled. No unsupported benchmark improvements, certifications or experience duration are claimed. See `docs/implementation/qa.md` for measured comparisons and remaining differences.
