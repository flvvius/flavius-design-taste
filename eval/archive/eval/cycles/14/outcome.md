# Cycle 14: Selection after colour replacement

Chromium's forced-colour mode made the paper and night palette buttons look identical. The browser replaced both borders with the same system colour. The selected option still had `aria-pressed="true"`, but its visible selection marker disappeared. The [baseline report](before-checks.json) and three before captures record this at commit `fa770a6`.

The two Personal room specimens now underline the selected palette button in forced-colour mode. The keyboard outline remains a separate marker. Ordinary paper and night styles retain their existing appearance. No palette token changed: this is an adaptation to the user's system colours, not another author palette.

The browser runner now checks forced-colour layouts at 320px and 1440px in both themes for all three maintained specimens. Keyboard checks verify a visible focus outline, selected-state markers after switching, and essential control borders. [After-checks](after/checks.json) retain the 48 layout reports and 15 interaction checks. The root agent reviewed the forced-colour captures. This was self-review, with Chromium emulation rather than a Windows device test.

The first Linux CI run also exposed a timing defect in the keyboard check. It measured destination geometry as soon as focus changed while smooth scrolling could still be in progress. Its [failure](ci-baseline.json) is retained. A [ten-run reproduction](scroll-timing.json) caught the same condition locally: one summary began below the viewport and then became visible. The test now waits up to three seconds for the focused summary to enter the viewport before asserting its bounds. An off-screen destination that never arrives still fails; there is no fixed sleep or skipped assertion.

The shared web guidance now calls for selection markers that survive colour replacement and keeps browser substitution enabled. [MDN's forced-colour reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/forced-colors) explains why shadows and author colours cannot carry those states alone. Screen-reader behavior and native high-contrast settings remain separate verification work.
