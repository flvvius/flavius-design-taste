# Cycle 21: Keep chart series visible after colour replacement

The usage chart's selected bars disappeared under forced colours. In Chromium and Firefox, their fill became the same white as the page. Previous-period bars kept their outlines but lost the stripe gradient. The legend lost the same distinctions. [Baseline measurements](before/marks.json) and [the Chromium capture](before/chromium.png) record the failure at commit `a6215c960c6af299ec47f362bfdb39d82efc8dfa`.

The chart and legend now use CanvasText on Canvas under the forced-colour media query. The solid and striped marks retain their identification through a scoped `forced-color-adjust: none`; the surrounding interface keeps automatic colour adjustment. No palette token changed. The [chart reference](../../../skills/editorial-calm/references/charts.md) carries the portable rule, and [the source study](../../research/2026-10-10.md) records the Observable Plot review and primary standards behind this cycle.

The usage example joins the maintained browser suite. Both periods run in both themes across every existing layout variant, with the exact-value table open. Each capture checks totals, table counts, accessible descriptions, category labels, axis order, a common zero baseline and proportional bar geometry. The checker measures solid-fill and striped-border contrast against adjacent backgrounds and requires the stripe image to remain present. The screenshot review verifies the actual pattern; the checker does not sample every gradient pixel.

The [first audit](before/initial-audit.json) reported 36 contrast failures because the new measurement compared solid marks with their own backgrounds. That was a checker defect, not 36 product failures. The corrected measurement starts from the parent backdrop. A deliberate erased-pattern fixture and an incorrect-scale fixture both fail the audit in all three engines. Repeated month/week/month changes also preserve exact values and focus on the period control.

| Local engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/chromium.json) | 108 | 58 | 0 | 0 |
| [Firefox](after/firefox.json) | 108 | 58 | 0 | 0 |
| [WebKit](after/webkit.json) | 108 | 54 | 4 | 0 |

The chart adds 36 layout checks per engine to the existing specimens and notebook. The reports retain captured source hashes, including the chart and its checker. WebKit's four unverified conditions concern colour substitution and the corresponding control-boundary checks, one per surface. It matches the media query without substituting the full palette. Its explicit system-colour chart rules still render and are checked, but this does not establish native high-contrast substitution.

The root agent reviewed the retained forced-colour and enlarged-text captures. This is self-review. The marks and keys now remain visible, with the common scale and summaries intact. The open table's narrow headers still break awkwardly, which remains a design issue for the next layout cycle. These automated passes do not establish complete visual polish or screen-reader certification.

Validation: token build and package checks passed; all nine tooling fixtures passed in Chromium, and the new defect fixture passed in Firefox and WebKit. The full maintained browser run passed in each engine. CI uses the same expanded default suite and defect fixtures.
