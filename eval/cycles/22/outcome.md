# Cycle 22: Read exact values without cramped columns

The [baseline measurements](before/checks.json) found that each single-word table header split across lines at 320px with enlarged text. The page stayed within the viewport, so the previous overflow checks passed. A separate script-disabled run rendered empty totals and no value rows. The [enlarged capture](before/enlarged.png) and [script-disabled capture](before/no-script.png) retain those findings at commit `36c6f3f8a07e5f57495c0f3e5474384c8d93262f`.

At narrow widths, the exact counts now use labelled pairs grouped by bucket. Each count has its series and date beside it. The comparison table remains available on wider screens. The layouts use the page background and hairline-separated groups. CSS exposes one representation at a time; both receive the same period data. The [research notes](../../research/2026-10-10-tables.md) record the USWDS source review, its responsive variants and the standards used to choose this layout.

The default week now exists in the initial HTML, including totals, summary, bars, labels and exact counts. Period and appearance controls start disabled. Successful initialization enables them and follows the system appearance preference. Without scripts, the view states its fixed period and keeps the light appearance shown by the disabled control. Its disclosure still opens natively.

The checker verifies both sets of dates and values against independent expectations. It also rejects fragmented series labels and numbers even when the page has no overflow. An injected one-character label width confirms that rejection in each engine. Live resizing from narrow to wide and back keeps the selected month and exposes only the appropriate table or definition-list roles. Retained browser accessibility snapshots record these role observations; they are not screen-reader sessions.

Five additional script-disabled cases per engine cover narrow and wide reading, spacing overrides, forced-colour media rules and enlarged text with font requests aborted. The native font set must settle, and a failed registered face must be observed before the missing-font case can pass. Those runs check the same default values, graphic scale and layout as the enhanced view.

The script-disabled spacing case also found a harness defect. The [independent probe](before/spacing-probe.json) measured the injected spacing in every engine while `addStyleTag` remained pending during observation. Inspection of the installed Playwright implementation showed that inline style insertion waits for a load callback. The helper now appends the inline style synchronously and checks that its rules exist. A separate fixture measures line, letter, word and paragraph spacing with page scripts disabled.

The [interrupted Chromium](before/interrupted-chromium.json), [Firefox](before/interrupted-firefox.json) and [WebKit](before/interrupted-webkit.json) reports retain the partial runs. The owned browsers were closed after the independent probe and implementation inspection established the blocked operation. Their later browser-closed failures describe that interruption, not additional product defects. Fresh runs use the corrected helper and separately captured inputs.

| Local engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/chromium.json) | 113 | 64 | 0 | 0 |
| [Firefox](after/firefox.json) | 113 | 64 | 0 | 0 |
| [WebKit](after/webkit.json) | 113 | 60 | 4 | 0 |

All captured runtime source hashes match the final files. The [Chromium](after/chromium-resize-semantics.json), [Firefox](after/firefox-resize-semantics.json) and [WebKit](after/webkit-resize-semantics.json) snapshots show the role changes during live resizing. WebKit's four unverified conditions still concern full-palette forced-colour substitution and corresponding control-boundary checks. Its media rules run separately.

The root agent reviewed the retained [enlarged month](after/chromium-usage-chart-dark-320-all-text-200-month.png), [wide comparison](after/chromium-wide-month.png) and [script-disabled font fallback](after/chromium-usage-chart-no-script-320-all-text-200-missing-font.png), plus the corresponding alternate-engine captures. Each narrow count retains its date and series; the wide view preserves column comparison. This is self-review. Actual screen-reader use and physical devices remain unverified.

Validation: token build and package checks passed. All ten tooling fixtures passed in Chromium. The six browser and chart fixtures passed in Firefox and WebKit. The complete maintained browser suite passed in all three engines. CI runs all ten fixtures and the expanded suite per engine.
