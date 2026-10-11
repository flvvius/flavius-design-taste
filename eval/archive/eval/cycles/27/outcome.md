# Cycle 27: Automatic colours before initialization

The [Chromium](before/chromium.json), [Firefox](before/firefox.json) and [WebKit](before/webkit.json) baselines match a dark system preference while painting the light palette with page scripts disabled. Reading survives, but colour selection still depends on initialization. The [other-surface probe](before/other-surfaces.json) finds the same mismatch in the main specimen, chart, search page and gallery.

The [research](../../research/2026-10-10-system-colours.md) inspects Primer CSS's pinned automatic-mode selectors. The portable token JSON now records browser selectors in `webTheme`. Generated CSS adds optional `data-theme="auto"` media rules and explicit light/dark root attributes. Existing `.dark` consumers retain their manual behavior. Palette values and native dimension values are unchanged. No framework, service or dependency was added.

All five maintained Editorial calm pages opt into automatic mode in initial HTML. Native CSS follows preference before scripts run and through live changes. Healthy controls set explicit choices; later preference changes preserve those choices. The chart and search selectors start at System and can return to it. Theme controls remain unavailable until their handlers are ready.

The fixtures exercise eight root configurations under both preferences, including automatic mode with a stale `.dark` class and explicit light with that class. Deliberately removing automatic rules, overriding the native control scheme or painting a wrong page background fails verification. Another fixture removes the library's explicit root-mode update. The checks compare every authored palette role with captured tokens, then inspect computed body colours and the native control scheme. Forced-colour cases retain authored-role checks and separate substitution checks; computed page colours there are not compared with the normal palette.

The [first Chromium](before/first-run-chromium.json), [Firefox](before/first-run-firefox.json) and [WebKit](before/first-run-webkit.json) runs each failed five chart reading expectations. Those checks still required Light after the initial selector changed to System. The correction checks System and automatic mode while preserving the chart's independent reading facts. A separate [adapter reproduction](before/class-only-adapter.json) exposed a more serious evidence problem: the main specimen's test changed `.dark` while automatic mode remained active, allowing a light page to receive a dark capture label. The adapter now uses the actual theme control. Every maintained light/dark layout also verifies its palette, so that mismatch fails the run.

| Local engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/local-chromium.json) | 372 | 339 | 0 | 0 |
| [Firefox](after/local-firefox.json) | 372 | 339 | 0 | 0 |
| [WebKit](after/local-webkit.json) | 372 | 333 | 6 | 0 |

The full suites retain the previous six-surface matrix. Thirty library reading layouts cross three initialization conditions, both preferences and five width/text/font settings. Three reading timelines change preference with scripts disabled or initialization interrupted. Eight more reading layouts cover the other maintained consumers in both schemes. Healthy button and selector timelines exercise automatic changes and explicit overrides. The default run includes the gallery's reading and theme checks; selected surfaces receive their relevant checks.

The root agent reviewed the [main specimen's actual dark capture](after/chromium-editorial-calm-dark-320-normal.png), [wide library reading headings](after/chromium-document-library-reading-disabled-dark-1440-normal.png), [Firefox missing-font failure view](after/firefox-document-library-reading-media-dark-320-missing-font-all-text-200.png), [WebKit interrupted enlarged view](after/webkit-document-library-reading-date-dark-320-all-text-200.png), and the dark script-disabled [chart](after/chromium-usage-chart-reading-dark-320.png), [search page](after/chromium-article-search-reading-dark-320.png) and [gallery](after/chromium-evaluation-gallery-reading-dark-320.png). Reading hierarchy, status labels and separators remain visible. This is self-review of browser captures, not physical-device or assistive-technology verification.

The complete Linux suites also pass:

| CI engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/ci-chromium.json) | 372 | 339 | 0 | 0 |
| [Firefox](after/ci-firefox.json) | 372 | 339 | 0 | 0 |
| [WebKit](after/ci-webkit.json) | 372 | 333 | 6 | 0 |

Validation: token build and package checks pass locally. The [CI run](https://github.com/flvvius/flavius-design-taste/actions/runs/38043826763) passed all four jobs, including the tooling fixtures and complete browser suites. The Chromium job records eighteen passing tooling tests. The three local theme-fixture runs also pass. All six final browser reports match runtime source `34d9e64a883880f424dbfb501710ffe1ba29a09b`. The [environment record](after/verification-environments.json) distinguishes local captures from Linux artifacts. The root agent reviewed the retained Linux wide reading view and the Firefox and WebKit missing-font captures.

The next [native-command study](../../research/2026-10-10-native-commands.md) and [three-engine baseline](../28/before/chromium.json) identify a remaining specimen defect. Without scripts, Review opens nothing, and Preview invitation navigates to a fresh page without a draft. Palette verification does not establish those actions' behavior. WebKit's six unverified conditions still concern forced-colour substitution and its boundary checks.
