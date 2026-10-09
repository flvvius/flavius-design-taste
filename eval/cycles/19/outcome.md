# Cycle 19: The invitation preview exists

The Editorial calm specimen labelled its form action "Preview invitation". Submitting a valid email address displayed a success message, but no preview or recipient. The [baseline report](before/checks.json) and [capture](before/preview.png) retain this behavior at commit `5d42ad5`.

The revised example displays the recipient and invitation draft in a named native dialog. Its hierarchy starts with the preview title, then the address, message and draft status. The surface belongs to the overlay; the underlying workspace keeps its existing page structure. Long addresses wrap and excess content scrolls within the usable viewport. Initial focus starts on the title so reading begins at the top. The close action remains reachable through keyboard navigation.

Native form validation blocks blank or malformed email addresses. Escape and the close button retain the entered address and return focus to the element that submitted the form. A later preview uses the current address. Editing clears the previous close status. The dialog shows a draft and does not send email.

The [browser report](after/checks.json) passes 72 layout checks and 16 interaction checks. It covers ordinary layouts and open previews in both themes, including long addresses, spacing overrides, forced colours, all-text enlargement and a short viewport. The interaction checks cover invalid input, keyboard opening, heading focus, an inert background, both dismissal paths and changed recipients on repeat use. Captured input hashes identify the exact files tested.

The root agent reviewed [light mobile](after/preview-light-390.png), [dark desktop](after/preview-dark-1440.png) and [short mobile](after/preview-light-320.png) captures, along with [enlarged reading](after/preview-enlarged-reading.png) and [action](after/preview-enlarged-action.png) states. The [short-viewport report](after/short-viewport.json) records the visible action bounds at 320 by 480 pixels with doubled text. This is self-review. The visual composition retains the existing quiet section hierarchy and graphite controls. The enlarged overlay scrolls instead of reducing text size or concealing the action.

The [first test report](before/first-checks.json) exposed a harness timing issue after dismissal: it sampled status text before the queued native close event ran. The assertion now waits for the event's observable result. This follows the [HTML dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element). The [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) informed reading focus and return to the invoker.

The shared review guide now asks whether each action produces the result its label promises. Invitation content stays in the example. No palette or shared dimension token changed. Native platforms, physical virtual keyboards and screen-reader behavior remain unverified by this browser cycle.
