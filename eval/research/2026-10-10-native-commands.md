# Native review commands and unavailable previews

Reviewed on 10 October 2026 while the colour correction was being verified.

The [HTML button specification](https://html.spec.whatwg.org/multipage/form-elements.html) defines `commandfor` and `command="show-modal"` for opening a native dialog. It makes the button the command source and handles an already-open dialog. [MDN's command property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/commandForElement) reports support in current browser versions since December 2025. That is compatibility guidance, not evidence for this specimen's behavior.

The cycle 28 probe tests the installed engines directly with page scripts disabled. In Chromium, Firefox and WebKit, the current Review button remains enabled but opens nothing. Adding only the native command attributes to the served button opens its existing dialog; the native close form closes it. The probe records property support and actual activation separately. Older browsers and repeated keyboard activation still need coverage before adoption.

The invitation action has a different failure. After entering a valid test address and activating Preview invitation without scripts, all three engines navigate to a fresh document, clear the field and show no preview or feedback. A dynamic recipient preview needs initialization, so its controls should stay unavailable until their handler is ready. This is a local demonstration; no email transport or backend is required. The next cycle should preserve normal preview, cancellation, validation and focus behavior, and test interrupted setup.
