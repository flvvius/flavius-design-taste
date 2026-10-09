# Build, review, fix

Each numbered cycle uses the current skill to build a working screen. A separate agent reviews the artifact and browser evidence. Confirmed defects lead to changes in the shared taste, tokens, examples or tooling, followed by another check and a commit.

Cycle folders retain the builder's artifact and notes, browser screenshots, checks and an outcome report. The browser scanner checks narrow and wide layouts in both themes, plus 200% text enlargement on narrow screens. Its contrast findings are candidates for review, not a substitute for inspecting the screen.

Open [index.html](index.html) locally to browse the completed screens. Run `npm run eval:gallery` to regenerate that gallery after adding a cycle.

Install development dependencies with `npm ci`, install Chromium with `npx playwright install chromium`, then run `node scripts/evaluate.mjs 01` for a cycle. The skill itself does not require these tools.

## Completed cycles

| Cycle | Scenario | Result |
| --- | --- | --- |
| [01](cycles/01/outcome.md) | Account and security | Semantic-pair contrast fixed; shared specimen wraps enlarged text. |
| [02](cycles/02/outcome.md) | Notification controls | Essential input boundaries strengthened; status roles clarified. |
| [03](cycles/03/outcome.md) | Localized finances | Amounts stay intact; localized controls wrap; type dimensions exported. |
| [04](cycles/04/outcome.md) | Document library | Real selection hit areas and visible narrow-table controls. |
| [05](cycles/05/outcome.md) | Appointment booking | Long enlarged titles wrap; local asset checks cover the artifact collection. |
| [06](cycles/06/outcome.md) | Project navigation | Routing/history/focus passed; reviewed screens have a local gallery. |
| [07](cycles/07/outcome.md) | Usage analytics | Axes corrected; category labels survive enlargement; chart guidance added. |
