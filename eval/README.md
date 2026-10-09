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
| [08](cycles/08/outcome.md) | Profile review dialogs | Long reviews begin with visible focus; overlay guidance and stable snapshots added. |
| [09](cycles/09/outcome.md) | Asynchronous search | Latest-request, retry and composition checks passed; tested search guidance added. |
| [10](cycles/10/outcome.md) | Browser and SwiftUI handoff | Actual native controls captured; isolated snapshot preferences; native verification guidance added. |

Four builder agents and two independent reviewer agents contributed to these ten cycles. Fresh builders read the revised skill as the loop progressed. Passing reviews remain passing; confirmed findings have retained resolution evidence.

The final [artifact audit](final-audit.json) covers all ten screens and 60 clean browser layout reports. The [gallery checks](gallery-checks.json) cover ten entries, keyboard theme switching and normal/enlarged text at narrow and wide widths in both themes. [Native checks](cycles/10/native-checks.json) record two compiled macOS capture runs with identical pixels across four variants. These checks do not establish screen-reader or mobile certification.
