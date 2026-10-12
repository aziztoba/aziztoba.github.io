# Entrance transition correction — 2026-10-12

The original implementation replaced Enter with a 420 ms fade/blur. Reviewing the supplied 27-second recording and interacting with the reference revealed the omitted sequence: code glyphs scramble and dissolve; the eye becomes a black circular opening; a glowing rim and radial streaks expand across the viewport; the editor appears.

`EntranceTransition` draws an original procedural version in Canvas, using the selected palette. The 2.8-second sequence follows the supplied recording (approximately 20.0–22.8 seconds). Mouse and keyboard share the same entry handler. Next.js prefetch/navigation retains the overlay until the route is ready. Reduced-motion users navigate immediately. Canvas animation and resize listeners are cleaned up on unmount.

## Verification

- Reproduced the missing effect with a failing browser test before implementation.
- Six unit tests and all 19 browser tests passed, alongside type checking and the static production build.
- New tests exercise mouse/keyboard entry, opaque black center and visible particle rendering, eventual navigation, mobile dimensions, repeated input, and reduced-motion bypass.
- Inspected reference and implementation captures at 1440 × 900, plus the supplied recording and screenshot. Checked the mobile implementation at 390 × 844 and the White Gold palette. Browser viewport resizing during the effect was independently checked without errors.
- Original implementation screenshots: `entrance-radial-desktop.png`, `entrance-radial-mobile.png`, `entrance-radial-light.png`.

The sequence, palette, ring, streaks, and expansion are recreated; particle positions and code glyphs are original and are not a frame-for-frame copy. Physical-device GPU performance was not measured. The recording was used locally for research and is not shipped as an application asset.
