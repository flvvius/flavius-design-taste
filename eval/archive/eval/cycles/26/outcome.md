# Cycle 26: Reading before enhancement

The [Chromium](before/chromium.json), [Firefox](before/firefox.json) and [WebKit](before/webkit.json) baselines show an empty library when page scripts are disabled. No document rows or count appeared, and five clipped header controls remained in the tab sequence. The initial HTML now contains all eight records, their dates and the active count. Native controls stay disabled until initialization finishes, with a reading-view explanation in place of unavailable keyboard instructions.

The enhanced data comes from those initial records. A fixture changes an owner and a machine-readable date in the served HTML, then checks the resulting owner, displayed date and sorted order after initialization. There is no second JavaScript array of document facts to maintain. Dates use native `time` elements in both views.

Rendering builds a complete fragment before replacing the table body. An injected formatter failure on the second record leaves the original eight rows intact. Another fixture interrupts initialization at the first media query, after some handlers have been attached. Both leave the native controls disabled and out of the tab sequence. Deliberately discarding the initial rows before building the replacement fails the reading check. Enabling an unavailable selector also fails it.

Visual review found a problem the first passing runs missed. Disabled sort buttons dimmed the wide table's column headings, even though those words still identify reading content. The [earlier capture](before/wide-reading-dimmed.png) shows the faint labels. The headings now retain full text opacity while their controls remain disabled. A fixture rejects the dimmed version. The preceding run summaries retain their original source hashes in `before/pre-heading-opacity-*.json`.

The [research](../../research/2026-10-10-progressive-reading.md) records GOV.UK's content-first guidance and pinned accordion markup and initialization. The shared web reference adds a short reading-before-enhancement rule. The specimen keeps its own data, actions and page structure. No token value, framework dependency or service was added.

| Local engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/local-chromium.json) | 143 | 148 | 0 | 0 |
| [Firefox](after/local-firefox.json) | 143 | 148 | 0 | 0 |
| [WebKit](after/local-webkit.json) | 143 | 147 | 1 | 0 |

Each focused run includes the preceding 128 library layouts and 15 new reading layouts. The latter cross disabled scripting and two initialization failures with narrow, wide, enlarged-text, spacing and missing-font conditions. They check independent document facts, count, native unavailability, column-label opacity, keyboard traversal and layout. Reading cases use the light scheme. Seven enhanced states still run in both themes, with responsive focus, mouse and touch activation, archive, restore and undo checks. WebKit's unverified condition concerns full forced-palette substitution.

The root agent reviewed the [wide reading labels](after/chromium-reading-disabled-1440-normal.png), narrow reading view, [Firefox missing-font failure view](after/firefox-reading-media-320-missing-font-all-text-200.png) and [WebKit interrupted enlarged view](after/webkit-reading-date-320-all-text-200.png). Content keeps its reading hierarchy and row separators. This is self-review; it does not establish assistive-technology or physical-device behavior.

The complete Linux suites also pass:

| CI engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/ci-chromium.json) | 349 | 308 | 0 | 0 |
| [Firefox](after/ci-firefox.json) | 349 | 308 | 0 | 0 |
| [WebKit](after/ci-webkit.json) | 349 | 302 | 6 | 0 |

Validation: token build and package checks passed locally. The [CI run](https://github.com/flvvius/flavius-design-taste/actions/runs/38040946876) passed its package job, all fifteen tooling fixtures in each browser job, and the complete six-surface suites. All final local and CI browser reports match the runtime source at commit `776f3de00e68c19cb1712b1846109a2a22ad6c4f`. The [environment record](after/verification-environments.json) distinguishes local and CI captures. The root agent also reviewed the retained Linux wide reading view and Firefox and WebKit missing-font captures. WebKit's six full-suite unverified conditions concern forced-palette substitution and its boundary checks.

The follow-up [system-colour study](../../research/2026-10-10-system-colours.md) and [three-engine baseline](../27/before/chromium.json) identify remaining work. With page scripts disabled, each browser matches a dark system preference while the page still paints its light palette. Reading now works, but automatic palette selection still depends on script initialization. Archive actions remain local specimen state; this cycle does not add persistence across reloads.
