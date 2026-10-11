# Cycle 28: Actions before enhancement

The three-engine baseline found two failures with scripts disabled. Review opened nothing, and Preview invitation navigated to a fresh document without a draft. The [native-command study](../../research/2026-10-10-native-commands.md) records the browser command behavior and repeated keyboard dismissal before implementation.

Review now opens its existing dialog through a native button command. A JavaScript fallback handles absent or unsupported command attributes. The invitation email field and preview button start disabled with associated, visible availability help. They enable only after every required handler attaches. Early media initialization failure and late preview-handler failure leave the controls unavailable, preserving the page as a reading view without accidental form navigation. Healthy initialization retains native email validation, the current recipient, draft cancellation and focus recovery.

Three-engine tooling fixtures exercise scripts disabled, both initialization failures and a served page with native command attributes removed. The fallback fixture verifies actual modal behavior. Five deliberate defects must fail, including a nonmodal dialog and prematurely enabled form controls. Each engine passes all 21 tooling tests.

The complete suites add thirty reading conditions across three initialization modes, two colour schemes and five width, enlargement, spacing or missing-font settings. Each condition checks the reading content and unavailable form, then repeats Review opening and dismissal with Enter, Space, Escape and Close. Another open-dialog capture checks layout and a visible Close control. Focus checks reject page controls behind the modal. They record browser chrome navigation separately when Tab leaves the document, rather than falsely requiring focus to remain on Close.

The first full WebKit run failed six missing-font assertions. A [focused probe](before/webkit-font-capture.json) showed that screenshot capture changed the reported Inter font status from error to unloaded. The correction checks and records the failed font before capture. It preserves the requirement for an actual failed font and all reading, modal and layout assertions. The [first runs](before/first-run-webkit.json) and [diagnostic](before/webkit-font-diagnostic.json) remain in the evidence record.

| Environment and engine | Layout checks | State and interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Local Chromium](after/local-chromium.json) | 432 | 370 | 0 | 0 |
| [Local Firefox](after/local-firefox.json) | 432 | 370 | 0 | 0 |
| [Local WebKit](after/local-webkit.json) | 432 | 364 | 6 | 0 |
| [CI Chromium](after/ci-chromium.json) | 432 | 370 | 0 | 0 |
| [CI Firefox](after/ci-firefox.json) | 432 | 370 | 0 | 0 |
| [CI WebKit](after/ci-webkit.json) | 432 | 364 | 6 | 0 |

The [Linux CI run](https://github.com/flvvius/flavius-design-taste/actions/runs/38046139397) passed the package job and all three browser jobs, including tooling fixtures. All six browser reports match the runtime source hashes at commit `17ea0bacf8f5c0cc8cd0cff940847a280e5adecf`. The [environment record](after/verification-environments.json) distinguishes local reports from CI artifacts. Palette values, dimensions and dependencies are unchanged.

Self-review covered Chromium's narrow dark reading view, native Review panel, enlarged missing-font panel and enlarged light interrupted reading view. The short invitation preview retains a visible heading and scrollable content; its checks verify keyboard access to Close. Firefox and WebKit missing-font Review captures were also reviewed. These captures do not establish physical-device or screen-reader behavior. WebKit's six unverified conditions concern forced-colour substitution. The fallback mutation verifies behavior in the installed engines, not compatibility certification for older browsers.

Cycle 28 closes the improvement run at the user's requested boundary. The previously captured [native baseline](../29/before/README.md) is archived as exploratory evidence; it is not a completed cycle 29.
