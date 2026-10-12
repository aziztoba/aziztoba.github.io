# Mouse hand correction — 2026-10-12

The supplied screenshot showed a missing mouse outline, articulated right hand, tracking box and live pointer coordinates. Reference browser interaction confirmed separate mouse/keyboard poses and a button highlight. The existing shared desk renderer only drew two keyboard hands.

The shared renderer now draws an original mouse silhouette and finger-joint pose. Pointer activity moves the right hand onto the mouse; keyboard activity and terminal typing return it to the keyboard. Press/release updates the button highlight and index/middle finger. Coordinate labels report the actual pointer and rendered hand positions. Both entrance and editor use the same renderer; the canvas is wider to fit the mouse telemetry without moving the keyboard center. Pointer cancellation and window blur release the highlight.

## Verification

- Observed reference and portfolio at 1440 × 900; compared the mouse outline, hand pose, tracking rectangle, finger joints and labels with the supplied crop.
- Browser regression failed on the original renderer (no mouse-area pixels), then passed with mouse/keyboard switching and click highlighting.
- Six unit tests and all 20 browser tests passed. Type checking and static production build passed. Existing mobile and reduced-motion visibility behavior is preserved.
- Local captures: `mouse-hand-desktop.png`, `mouse-hand-click.png`, `mouse-hand-keyboard.png`.
- Original procedural geometry approximates the reference; joint coordinates are not copied from reference source. Physical-device performance and browsers other than Chromium were not checked.
