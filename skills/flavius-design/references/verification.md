# Verification and handoff

Use the same routes, content fixtures, states, viewport widths and supported themes before and after. Keep capture manifests with timestamps, environment, actual theme observations and source revisions. Inspect screenshots. A matching dark media query alone does not prove the dark palette rendered.

Run the project's build and meaningful tests, then execute every behavior-contract trigger. Recheck auth/permissions, redirects, query parameters, history, validation, dirty drafts, cancellation, mutations, analytics and focus where present. Use safe fixture data. A manual smoke checklist records actual interactions and outcomes, not a list of intended tests.

Measure rendered text against its actual background. Normal text needs 4.5:1, large text 3:1. Essential control boundaries and focus need 3:1; incidental hairlines can be quieter. Images, texture, alpha groups and charts need appropriate inspection beyond a solid-text scanner.

Traverse by keyboard. Check names, visible focus, dialog containment and focus return, selected-state cues and targets. Check 320px reflow and 200% text separately; double all explicit and inherited text once. Apply user spacing overrides where they can reveal defects. Preserve readable amounts and essential actions.

Check empty/loading/error, long content and open dialog states. Repeat important actions. Confirm that each action produces the result its label promises. Check reduced motion and script/font failures when the architecture offers those fallbacks. Do not turn a small remote application into a mandatory offline product.

Re-score the audit rubric using captures and interactions. Functional or accessibility failures block delivery even when the visual result looks better. Keep usability, product fit and taste distinct. State self-review when no independent reviewer took part.

Report three categories:

- Verified: command, environment, observed result and evidence path.
- Failed: trigger, actual outcome, user consequence and recovery or outstanding work.
- Unverified: what was not run and why.

Tests do not certify screen readers, native platforms or physical devices without direct evidence. Deliver before/after, rationale, regression results and known limits with reviewable code. Do not publish or contact anyone merely because a handoff template exists.

A failed capture is evidence too. Keep its attempted route/state, response status, page errors and screenshot when available. If a development page stalls before hydration, diagnose the disabled control or runtime error before retrying; keep the failed attempt separate from the successful matrix.

For doubled-text review, inspect the actual image as well as geometry. Fixed pixel line heights can overlap larger text while scrollWidth still equals the viewport. Check leftward overflow and readable line spacing before calling reflow a pass.
