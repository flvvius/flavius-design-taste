# Cycle 01: account and security

A builder agent created the account/preferences screen from the skill. A separate agent reviewed the rendered screen and exercised validation, local saving, password checks and enlarged text.

The baseline audit exposed two invalid foreground/background pairs and overflow in the shared browser specimen. Light success label contrast improved from 4.35:1 to 4.94:1. Dark destructive label contrast improved from 2.77:1 to 6.89:1. Wrapping the generic specimen's rows and header keeps it within a 320px viewport with 32px body text.

The package check now enforces 4.5:1 for semantic foreground/background pairs. Browser checks cover 375px and 1280px in both themes. The review rejected the scanner's small-checkbox warning because the clickable label supplies a 44px target. This is why candidate findings need review.

Evidence is in baseline-contrast.json at the eval root, before-checks.json, checks.json, review.json and the four screenshots. The skill remains usable without evaluation dependencies.
