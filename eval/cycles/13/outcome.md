# Cycle 13: Trustworthy package and browser checks

A checker should fail for the defects it claims to detect. The old colour helper measured eight-digit hex colours as opaque. Its ratio for half-transparent black on white was 21:1; compositing first gives about 4:1. The OKLCH converter also accepted valid-looking substrings inside malformed input.

The [baseline values](before-checks.json) came from the source at commit `59c14fc`. The new contrast helper composites foreground alpha, requires an explicit opaque canvas for transparent backgrounds and rejects malformed hex values. The converter validates the whole supported expression and channel ranges. Existing generated palette values do not change.

[Colour tests](../../../scripts/tests/color.test.mjs) cover opaque anchors, alpha blending, transparent backgrounds and invalid input. [Browser-helper tests](../../../scripts/tests/browser-checks.test.mjs) deliberately render low contrast and clipped text, and verify that doubling inherited and explicit text does not compound the scale. They also check server root handling and error status responses.

The reproducible browser runner retains source hashes, runtime/request errors, layout measurements, interaction results and screenshots. A runner exception becomes a failed report. The report explains its limits; solid-background text scanning does not certify photographs, opacity groups, SVG marks, screen readers or visual composition.

CI now runs the package checks, the meaningful tooling tests and browser verification, and retains browser artifacts even on failure. Each skill folder includes the repository licence and all of its local linked dependencies. The package checker verifies those folders independently.

This pass is a tooling review by the root agent. No independent agent took part. See the [test results](tests.txt) for the executed fixture checks. A future change can rerun these commands without depending on a temporary script or paid service.
