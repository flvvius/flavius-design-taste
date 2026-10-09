# Overlays

Dialogs and sheets earn a surface because they cover the page. Use popover/foreground roles, an overlay scrim and the overlay radius. Content beneath them keeps its ordinary page hierarchy.

Prefer native dialog, sheet or trusted component behavior. Give the overlay an accessible name and clear actions. Keep background content inert while a modal is open. Preserve drafts on cancellation and return focus to the control that opened it.

Choose initial focus for the content. A destructive confirmation usually starts on the safe action. A long reading dialog may start on a focusable heading so users can read from the top. Check that the initial focus is visible and does not skip needed context.

Constrain the surface to the usable viewport and let long content scroll inside it. Check enlarged text, long unbroken values and the virtual keyboard. Actions must remain reachable; a small dialog must not turn into clipped text with inaccessible buttons. Avoid scrolling the covered page through the overlay.

Escape or platform Back should perform the documented cancellation behavior. Check focus containment, dismissal and recovery through keyboard or platform accessibility navigation.

Use the shared 200–250ms overlay timing and suppress optional movement with reduced motion. Inspect the fully visible surface when checking contrast. Snapshot tools should finish entrance animations rather than capture partially transparent text, while motion behavior is verified separately.
