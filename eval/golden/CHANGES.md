# Changes after actual runs

## VibeCodex

1. The original Next configuration sets ignoreBuildErrors and ignoreDuringBuilds. Baseline build passed while standalone TypeScript failed. Discovery now asks agents to inspect skipped checks and compare the separate command before/after. The same upstream type errors remain after the redesign; this run does not claim they passed.
2. A first development capture timed out on a disabled theme toggle before hydration. The old helper wrote an empty report list and lost the attempted route. Warm retry succeeded. Capture now records the attempted route/state, HTTP status, errors and a failure screenshot before throwing. An intentional unsupported-action fixture verified the failed record and screenshot. Verification now describes preserving failed attempts. No guessed root cause is claimed for the initial stall.
3. Initial visual changes still overflowed at 200% text on 320px. Browser geometry traced shared footer labels, long action labels and radio-grid minimum widths. The app patch fixed those causes and repeated the same checks. This was an implementation correction, not a new universal taste rule.

4. Screenshot review found overlapping doubled text and a leftward clipped action even after scrollWidth passed. Tailwind text-size utilities retained fixed line heights, and an older base-layer wrapping rule lost to utilities. The app now uses unitless reading line heights and explicit action wrapping. Verification guidance now requires image inspection, readable line spacing and leftward overflow checks; the saved smoke script records both sides of the viewport.

No other workflow guidance changed from this run. No backend error was fabricated for a catalog using local arrays.
