# Cycle 20: Maintain checks in three browser engines

The maintained browser runner used Chromium only. Firefox and WebKit preview probes from cycle 19 covered one interaction, not the full specimens. This cycle adds `--browser chromium`, `--browser firefox` and `--browser webkit`, with the existing default preserved. CI now runs the fixtures and complete suite in each engine and retains separate artifacts.

The first broader run exposed assumptions in the harness. The [WebKit report](before/webkit.json) records four failures. The [capability probe](before/capabilities.json) explains three differences: forced-colour media matching without colour replacement, Mac Tab traversal that skips links, and a family availability query that returned true while the registered font face was in an error state. No specimen CSS or palette changed to conceal those differences.

The [Firefox font probe](before/firefox-ready.json) found a settled native font set with scripts disabled, while an evaluated ready promise did not return during observation. The [interrupted run](before/firefox-run.json) and its [partial report](before/firefox.json) retain this finding. Closing the browser caused subsequent browser-closed failures; they do not establish product defects. Font readiness now uses a bounded external poll of native state. Loaded and missing faces are verified through their own status.

The next [Firefox report](before/firefox-hover.json) exposed a transform comparison made during initial CSS motion. The old check also dispatched a mouse event without activating `:hover`. The corrected measurement waits for settled motion, moves the actual pointer, confirms the hover selector and compares the final transforms. A [deliberately ungated lift fixture](after/fixtures.json) verifies that the measurement detects the defect in every engine. The valid coarse-pointer specimen retains its position.

Mac WebKit uses Option-Tab for the skip-link traversal, consistent with [Apple's keyboard guide](https://support.apple.com/guide/safari/keyboard-and-other-shortcuts-cpsh003/mac). Enter activation and destination focus remain checked. Forced-colour media rules and keyboard focus run in every engine. Actual palette substitution is probed independently, and unavailable conditions stay unverified.

| Local engine | Layout checks | Interaction checks | Unverified conditions | Failures |
| --- | ---: | ---: | ---: | ---: |
| [Chromium](after/chromium.json) | 72 | 19 | 0 | 0 |
| [Firefox](after/firefox.json) | 72 | 19 | 0 | 0 |
| [WebKit](after/webkit.json) | 72 | 16 | 3 | 0 |

WebKit's three unverified conditions are palette substitution and control boundaries under that substitution, one for each surface. Its media-rule checks still verify selected markers and focus. The reports identify the engine, binary version, source hashes and measured capabilities. They do not relabel an ordinary palette render as high-contrast substitution.

The root agent reviewed the captured handwriting specimens and enlarged invitation overlays in the alternate engines. This is self-review. The tastes retain their hierarchy and reading paths across the observed rendering differences. The shared review guide now asks for actual effects, named engines and unverified conditions. The skill folders keep working without Playwright or repository tooling.

Run the commands in the root README after installing the corresponding Playwright binaries. These engine builds do not establish branded-browser, physical-device, virtual-keyboard or screen-reader certification. The [Playwright browser documentation](https://playwright.dev/docs/browsers) describes the supported binaries and their installation.
