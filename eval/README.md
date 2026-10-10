# Build, review, fix

Each numbered cycle applies or checks the current taste. The first ten built working screens with separate builder and reviewer agents. Later cycles explicitly identify self-review; tooling cycles can test verification code rather than add a screen. Confirmed defects lead to changes in the shared taste, tokens, examples or tooling, followed by another check and a commit.

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
| [11](cycles/11/outcome.md) | Personal room resilience | All-text overflow and repeated-link failure fixed; reproducible browser checks added. Self-review. |
| [12](cycles/12/outcome.md) | Repair notebook | Personal room transfers to reading and editing with conventional controls. Self-review. |
| [13](cycles/13/outcome.md) | Verification tooling | Alpha contrast, colour validation and deliberate-defect fixtures improve the checks. Self-review. |
| [14](cycles/14/outcome.md) | Forced colours | Selected palettes retain a visible marker; keyboard checks wait for native scrolling. Self-review. |
| [15](cycles/15/outcome.md) | Native Personal room | iOS Dynamic Type scales handwriting, reading and wrapping actions; live updates pass. Self-review. |
| [16](cycles/16/outcome.md) | Native navigation | XCTest catches state leaking between notes and an off-screen enlarged destination. Self-review. |
| [17](cycles/17/outcome.md) | Optional native font | Missing Schoolbell no longer crashes; system type scales and preserves reading actions. Self-review. |
| [18](cycles/18/outcome.md) | Captured inputs | Browser serving and native packaging keep tested bytes and their hashes through edits. Self-review. |
| [19](cycles/19/outcome.md) | Invitation preview | The promised draft appears with its current recipient, validation and repeatable native dismissal. Self-review. |
| [20](cycles/20/outcome.md) | Browser engines | The maintained suite covers Chromium, Firefox and WebKit and records emulation limits. Self-review. |
| [21](cycles/21/outcome.md) | Chart series | Both periods retain solid and striped marks under forced colours; exact values and bar geometry join the maintained checks. Self-review. |
| [22](cycles/22/outcome.md) | Readable chart values | Labelled pairs replace cramped narrow columns; the default week remains readable without scripts or the bundled font. Self-review. |
| [23](cycles/23/outcome.md) | Search states and reading | The bundled library remains readable without scripts; five states and asynchronous transitions join the maintained checks. Self-review. |
| [24](cycles/24/outcome.md) | Responsive library controls | Focus transfers in both directions; sorting, selection and archive history join the maintained interaction checks. Self-review. |
| [25](cycles/25/outcome.md) | Library states and targets | Complete choices fit enlarged text; native targets and empty-row width receive maintained checks across seven states. Self-review. |
| [26](cycles/26/outcome.md) | Library reading fallback | Initial records survive unavailable scripts and two setup failures; controls enable after initialization. Self-review. |

Four builder agents and two independent reviewer agents contributed to cycles 01 through 10. Fresh builders read the revised skill as the loop progressed. Passing reviews remain passing; confirmed findings have retained resolution evidence.

The final [artifact audit](final-audit.json) covers all ten screens and 60 clean browser layout reports. The [gallery checks](gallery-checks.json) cover ten entries, keyboard theme switching and normal/enlarged text at narrow and wide widths in both themes. [Native checks](cycles/10/native-checks.json) record two compiled macOS capture runs with identical pixels across four variants. These checks do not establish screen-reader or mobile certification.

## Research and current checks

The [research pass](research/2026-10-09.md) records the upstream repositories, designer methods, measurable standards and decisions used for cycles 11 through 20. [Repository revisions](research/sources.json) make that comparison repeatable. The [chart study](research/2026-10-10.md) and [responsive values study](research/2026-10-10-tables.md) add pinned Observable Plot and USWDS source reviews for cycles 21 and 22. The [search study](research/2026-10-10-search.md) adds a pinned Adobe list-state review and browser event evidence for cycle 23. The [responsive focus study](research/2026-10-10-focus.md) records W3C guidance and three-engine reproduction for cycle 24. The [control study](research/2026-10-10-controls.md) adds a pinned GOV.UK source review and the empty-grid finding for cycle 25. The [progressive reading study](research/2026-10-10-progressive-reading.md) examines its initial markup and control initialization for cycle 26.

Run `npm run test:tooling` for conversion and browser-helper fixtures. Run `npm run check:browser -- --output .artifacts/browser` for the maintained specimens, the repair notebook, both usage-chart periods, five article-search states and seven document-library states. Use `--browser chromium`, `--browser firefox` or `--browser webkit` to select an engine. The default is Chromium. Optional repeated `--surface` arguments select `personal-room`, `editorial-calm`, `repair-notebook`, `usage-chart`, `article-search` or `document-library`. The default checks all six. Selecting `document-library` also runs its focus, archive-history, pointer-padding, missing-font and initial-reading checks. The matrix includes normal, enlarged, spacing and forced-colour layouts; domain checks verify the visible state separately. A failed measurement or runner error returns a failing exit code. Reports and captures identify their source hashes and limitations.

Historical evidence belongs to its recorded source version. Regenerating the gallery does not revalidate those screens, and the old ten-cycle final audit is not a claim about later experiments. The [iOS Personal room checks](cycles/15/after/checks.json) add simulator layout, live Dynamic Type changes and programmatic control events. The [native UI checks](cycles/16/after/checks.json) add simulator swipes, taps and unfiltered Apple accessibility audits. Screen-reader use, physical devices, hardware keyboards and other native platforms remain unverified.
