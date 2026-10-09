# Cycle 23: Search states and a reading path before enhancement

The library example already guarded asynchronous completions with request generations. Its earlier independent review found no actionable defect. The [new script-disabled baseline](before/no-script.json) found a separate failure: the page showed no articles and no status explanation, while three search controls remained enabled. The [capture](before/no-script.png) records that view at commit `b191f7d639c129f3dabecd205a76f7aa3e443517`.

The six bundled articles now live in initial HTML rows with native disclosures. The script reads those records, initializes filtering and enables the controls. Without it, the reader can still open every excerpt. The fallback instructions describe reading and the status explains unavailable search controls. Successful initialization supplies the enhanced searching instructions and follows the system appearance preference. No fetching library, framework or service is added.

The maintained suite now captures untouched, loading, completed, empty and failed searches in both themes and every layout variant. Completed captures include an open excerpt. Each capture checks the visible query, status, busy state, loading visibility, retry action and exact result titles. The status remains outside the busy region. A controlled clock separates debounce from loading and completion.

A transition sequence checks a slow success after a newer result, an obsolete failure during current loading, clearing pending work, simulated composition, retry recovery, repeated failure and native keyboard excerpt opening. A deliberate fixture removes the two completion guards. The healthy sequence passes; the mutation is rejected specifically when the slow request replaces the newer climate results.

The [first Firefox run](before/firefox-composition.json) found an assumption in the simulation. The [event probe](before/composition-probe.json) shows that Firefox's `fill()` emits its own composition end event, unlike the other observed engines. Searching after that event was correct. The corrected case dispatches an input event marked as composing and submits without ending composition. The product guard stays unchanged. This simulation does not certify an operating-system input method.

The [research notes](../../research/2026-10-10-search.md) record the pinned Adobe source review, status-message guidance, controlled-clock method and scope of the reading fallback. The shared patterns guide applies the reading rule to small bundled collections and distinguishes content that requires a service.

| Local engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/chromium.json) | 206 | 160 | 0 | 0 |
| [Firefox](after/firefox.json) | 206 | 160 | 0 | 0 |
| [WebKit](after/webkit.json) | 206 | 155 | 5 | 0 |

All captured runtime hashes match the final files. The search adds 90 enhanced-state captures and three script-disabled captures per engine to the preceding suite. The retained [Chromium](after/chromium-transitions.json), [Firefox](after/firefox-transitions.json) and [WebKit](after/webkit-transitions.json) timelines identify the observations during the transition sequence. WebKit's five unverified conditions concern full-palette colour substitution and its corresponding control-boundary checks, one per surface. Media-rule and focus checks still run separately.

The root agent reviewed the retained [enlarged error](after/chromium-article-search-dark-320-all-text-200-error.png), [open result](after/chromium-article-search-light-320-all-text-200-results.png), [loading state](after/chromium-article-search-dark-1440-normal-loading.png) and [script-disabled reading](after/chromium-article-search-no-script-320-all-text-200-missing-font.png), plus the alternate-engine error and fallback captures. The page keeps its text hierarchy, page background and separated reading rows. This is self-review. Screen-reader announcements, real input methods and physical devices remain unverified.

Validation: token build, package checks and all eleven tooling fixtures passed in Chromium. The final query-field and stale-response fixture passed in Firefox and WebKit. It covers topic queries in the transition sequence and author/title queries after reading records from the HTML. The full browser suite passed in all three engines. CI runs the complete fixture set and expanded suite per engine.
