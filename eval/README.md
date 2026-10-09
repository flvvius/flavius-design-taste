# Build, review, fix

Each numbered cycle uses the current skill to build a working screen. A separate agent reviews the artifact and browser evidence. Confirmed defects lead to changes in the shared taste, tokens, examples or tooling, followed by another check and a commit.

Cycle folders retain the builder's artifact and notes, browser screenshots, checks and an outcome report. The browser scanner checks narrow and wide layouts in both themes. Its contrast findings are candidates for review, not a substitute for inspecting the screen.

Install development dependencies with `npm ci`, install Chromium with `npx playwright install chromium`, then run `node scripts/evaluate.mjs 01` for a cycle. The skill itself does not require these tools.
